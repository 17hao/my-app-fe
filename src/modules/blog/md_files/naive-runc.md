用 Golang 实现一个简易版[runc](https://github.com/opencontainers/runc)。

## Table of Contents

## 启动方式

```bash
# 下载 alpine linux 并解压到 /tmp/rootfs 目录
wget https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-minirootfs-3.19.1-x86_64.tar.gz
mkdir /tmp/rootfs && tar -zxvf alpine-minirootfs-3.19.1-x86_64.tar.gz -C /tmp/rootfs

# 启动简易版runc
go run main.go run
```
## 源码

```go
package main

import(
    "os"
    "os/exec"
    "path/filepath"
    "runtime/debug"
    "strconv"
    "syscall"

    "github.com/sirupsen/logrus"
    "golang.org/x/sys/unix"
)

func must(err error) {
    if err != nil {
        panic(err)
    }
}

// how to find out cgroup of a particular process?
// ps axo pid,command,cgroup | grep main
func cg() {
    newCgroup: = "/sys/fs/cgroup/system.slice/naive-runc.service"
    if _,
    err: = os.Stat(newCgroup);os.IsNotExist(err) {
        logrus.Info("cgroup is not exist, create cgroup")
        must(os.Mkdir(newCgroup, 0700))
    }
    must(os.WriteFile(filepath.Join(newCgroup, "memory.max"), [] byte(strconv.FormatInt(int64(10 * 1024 * 1024), 10)), 0700))
    must(os.WriteFile(filepath.Join(newCgroup, "cgroup.procs"), [] byte(strconv.FormatInt(int64(os.Getpid()), 10)), 0700))
}

func run() {
    cg()

    cmd: = exec.Command("/proc/self/exe", append([] string {
        "child"
    }, os.Args[2: ]...)...)
    cmd.Stderr = os.Stderr
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    // list namespaces: lsns|grep exe
    cmd.SysProcAttr = & unix.SysProcAttr {
        Cloneflags: unix.CLONE_NEWUTS | unix.CLONE_NEWPID | unix.CLONE_NEWNS | unix.CLONE_NEWUSER | unix.CLONE_NEWCGROUP,
        Unshareflags: unix.CLONE_NEWNS,
        UidMappings: [] syscall.SysProcIDMap {
            {
                ContainerID: 0,
                HostID: os.Getuid(),
                Size: 1,
            },
        },
        GidMappings: [] syscall.SysProcIDMap {
            {
                ContainerID: 0,
                HostID: os.Getgid(),
                Size: 1,
            },
        },
    }
    if err: = cmd.Start();
    err != nil {
        logrus.WithField("stack", string(debug.Stack())).Errorf("ERR: %v", err)
        return
    }
    if err: = cmd.Wait();
    err != nil {
        logrus.WithField("stack", string(debug.Stack())).Errorf("ERR: %v", err)
    }
}

func child() {
    logrus.Infof("child process pid=%d", os.Getpid())
    must(unix.Sethostname([] byte("container-1")))

    rootfs: = "/tmp/rootfs"
    if _, err: = os.Stat(rootfs);
    err != nil && os.IsNotExist(err) {
        logrus.Error("rootfs is not exist")
        os.Exit(1)
    }
    proc: = filepath.Join(rootfs, "/proc")
    must(unix.Mount("proc", proc, "proc", 0, ""))
    must(unix.Mount(rootfs, rootfs, "", unix.MS_BIND | unix.MS_PRIVATE | unix.MS_REC, ""))

    oldroot, err: = unix.Open("/", unix.O_DIRECTORY | unix.O_RDONLY, 0)
    if err != nil {
        logrus.Error("open old root failed")
        os.Exit(1)
    }
    defer unix.Close(oldroot)

    newroot, err: = unix.Open(rootfs, unix.O_DIRECTORY | unix.O_RDONLY, 0)
    if err != nil {
        logrus.Error("open new root failed")
        os.Exit(1)
    }
    defer unix.Close(newroot)

    must(unix.Fchdir(newroot))
    must(unix.PivotRoot(".", "."))
    must(unix.Fchdir(oldroot))
    must(unix.Unmount(".", unix.MNT_DETACH))
    must(unix.Chdir("/"))
    must(unix.Mount("", "/", "", unix.MS_BIND | unix.MS_REMOUNT | unix.MS_RDONLY, ""))
    
    cmd: = exec.Command(`/bin/sh`)
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    cmd.Env = [] string {
        `HOME=/root`,
        `PS1=\u@\h:\w\$ `
    }
    if err: = cmd.Run();
    err != nil {
        logrus.WithField("stack", string(debug.Stack())).Errorf("ERR: %v", err)
        return
    }
}

// su
// go build main.go
// ./main run
func main() {
    logrus.Infof("os.Args: %+v", os.Args)
    if len(os.Args) < 2 {
        logrus.Error("Usage: ./main run")
        return
    }
    switch os.Args[1] {
        case "run": run()
        case "child": child()
        default: logrus.WithField("stack", string(debug.Stack())).Error("unsupported command, usage: go run main.go run [command] <args>\n")
    }
}
```

## 代码解释
下载 [alpine linux](https://alpinelinux.org/) 并解压到 /tmp/rootfs 目录，/tmp/rootfs 有了运行 linux 系统所需的完整文件系统。

主进程执行 run() 函数，主要做以下几件事：
1. 在 /sys/fs/cgroup/system.slice 目录下为容器运行时创建 cgroup 资源
2. 设置子进程的启动命令和 cgroup 参数，目前支持了5种 cgroup 类型
3. 通过 /proc/self/exe 启动子进程，容器跑在子进程中

子进程执行 child() 函数，主要做以下几件事：
1. 设置 hostname
2. 把 proc 文件系统挂载到 /tmp/rootfs/proc 目录
3. 重新挂载 /tmp/rootfs，使它与宿主机文件系统隔离
4. 把容器 / 目录挂载到 /tmp/rootfs 目录
5. 把 /bin/sh 命令作为容器的启动命令，PS1 环境变量表示 command prompt
