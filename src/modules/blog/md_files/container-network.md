# 简易版docker网络

基于 Bash 实现简易版 docker 网络。分成4个步骤：
   1. 容器和容器互通
   2. 宿主机和容器互通
   3. 容器访问外部网络
   4. 外部网络访问容器

## Table of Contents

## 容器和容器互通

以下脚本可以使2个namespace实现通信。主要使用了Linux中的veth和bridge2类虚拟设备，通过veth，子namespace可以和根namespace通信，通过bridge，将2个子网进行连接。

```bash
#!/bin/bash

# 创建2个network namespace
ip netns add netns0
ip netns add netns1

# 创建2个veth设备，每个veth设备的一端在root network namespace，另一端在子network namespace
ip link add veth0 type veth peer name ceth0 netns netns0
ip link add veth1 type veth peer name ceth1 netns netns1

# 为veth子network namespace中的一端设置ip地址
ip netns exec netns0 ip addr add 172.18.0.10/16 dev ceth0
ip netns exec netns1 ip addr add 172.18.0.20/16 dev ceth1

# 启动veth
ip link set veth0 up
ip link set veth1 up
ip netns exec netns0 ip link set ceth0 up
ip netns exec netns1 ip link set ceth1 up

# 创建bridge设备，veth在root network namespace中的一端连接到bridge
ip link add br0 type bridge
ip link set br0 up
ip link set veth0 master br0
ip link set veth1 master br0

# 测试2个子network namespace连通性
ip netns exec netns0 ping -c 2 172.18.0.20

# ？？？ARP entries？？？
ip netns exec netns0 ip neigh
ip netns exec netns1 ip neigh

ip netns del netns0
ip netns del netns1
ip link del br0
```

几个注意事项：

1. 需要在未安装docker的机器上执行
2. root network namespace中的veth0、veth1无需配置ip地址，根namespace不会创建route表记录
3. bridge br0无需配置ip地址
4. 无法通过新增route表记录使得2个namespace实现通信，因为route会产生冲突

## 宿主机和容器互通

```bash
#！/bin/bash

# 为br0分配ip地址
ip addr add 172.18.0.1/16 dev br0
# 分配ip地址后会自动创建一条路由规则
# 宿主机通过br0，可以访问容器网络
ip route
> 172.18.0.0/16 dev br0 proto kernel scope link src 172.18.0.1


# 容器网络可以访问br0，但还是无法访问宿主机eth0
# 为子network namespace添加路由规则
ip netns exec netns0 ip route add default via 172.18.0.1
```

以上脚本分为2部分：

1. 宿主机访问容器网络
2. 容器网络访问宿主机

宿主机和容器网络属于2个不同的网段，需要通过virtual bridge br0设备实现互通。

## 容器访问外部网络

当容器网络访问外部网络时，目标server不知道需要给哪个ip地址进行回复，因为此时ip数据包中src字段的值为容器ip地址。我们需要借助nat技术，将IP地址修改为宿主机IP。

```bash
#!/bin/bash

echo 1 > /proc/sys/net/ipv4/ip_forward

iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

ip netns exec netns0 ping -c 2 8.8.8.8
```

启用ip forward意味着当宿主机收到目标地址未知的数据包时（本例为172.18.0.10，容器网络IP地址），并不会丢弃，而是会转发给br0（为br0添加ip地址时已创建route规则）。

MASQUERADE类似SNAT，具体的区别待学习。

数据包从NIC流向另一个NIC时（不经过本地进程），iptables各阶段执行顺序如下。

```
HOST_RAW_PREROUTING IN=br0 OUT= SRC=172.18.0.10 DST=8.8.8.8 
HOST_MANGLE_PREROUTING IN=br0 OUT= SRC=172.18.0.10 DST=8.8.8.8 
HOST_NAT_PREROUTING IN=br0 OUT= SRC=172.18.0.10 DST=8.8.8.8 
HOST_MANGLE_FORWARD IN=br0 OUT=eth0 SRC=172.18.0.10 DST=8.8.8.8 
HOST_FILTER_FORWARD IN=br0 OUT=eth0 SRC=172.18.0.10 DST=8.8.8.8 
HOST_MANGLE_POSTROUTING IN=br0 OUT=eth0 SRC=172.18.0.10 DST=8.8.8.8 
HOST_NAT_POSTROUTING IN=br0 OUT=eth0 SRC=172.18.0.10 DST=8.8.8.8 
```

## 外部网络访问容器

在子network namespace中启动web server：

```bash
ip netns exec netns0 python3 -m http.server --bind 172.18.0.10 9999
```

分3个场景考虑：

1. 通过容器IP访问（只能在宿主机中访问）
2. 通过宿主机IP访问（可以在宿主机或本地网络访问）
3. 通过公网访问（可以在本地网络或公网访问）

场景一：通过容器IP访问无须额外配置，已经满足要求。

场景二：通过宿主机IP访问，需要配置iptables规则，宿主机私有IP地址为172.16.152.18。

```bash
iptables -t nat -A OUTPUT -d 172.16.152.184/32 -p tcp -m tcp --dport 9999 -j DNAT --to-destination 172.18.0.10:9999
```

在宿主机执行`curl 172.16.152.18:9999`，数据包从本地进程流向NIC，经过的iptables阶段顺序如下，可以看到，经过nat表OUTPUT阶段处理后，目标IP地址变成了容器IP。

```
HOST_RAW_OUTPUT IN= OUT=lo SRC=172.16.152.184 DST=172.16.152.184 
HOST_MANGLE_OUTPUT IN= OUT=lo SRC=172.16.152.184 DST=172.16.152.184 
HOST_NAT_OUTPUT IN= OUT=lo SRC=172.16.152.184 DST=172.16.152.184 
HOST_FILTER_OUTPUT IN= OUT=lo SRC=172.16.152.184 DST=172.18.0.10 
HOST_MANGLE_POSTROUTING IN= OUT=br0 SRC=172.16.152.184 DST=172.18.0.10 
HOST_NAT_POSTROUTING IN= OUT=br0 SRC=172.16.152.184 DST=172.18.0.10 
```

场景三：通过公网IP访问，需要配置iptables规则，宿主机公网IP地址为39.99.43.51。

```bash
iptabls -t nat -A PREROUTING -d 172.16.152.184/32 -p tcp -m tcp --dport 9999 -j DNAT --to-destination 172.18.0.10:9999
```

在另一台主机（公网IP为47.102.157.109）上执行`curl 39.99.43.51:9999`，数据包从NIC进入宿主机后流向另一个NIC，经过的iptables阶段顺序如下，可以看到，经过nat表PREROUTING阶段处理后，目标IP地址被修改为容器IP。 

```
HOST_RAW_PREROUTING IN=eth0 OUT= MAC=.. SRC=47.102.157.109 DST=172.16.152.184
HOST_MANGLE_PREROUTING IN=eth0 OUT= MAC=.. SRC=47.102.157.109 DST=172.16.152.184
HOST_NAT_PREROUTING IN=eth0 OUT= MAC=.. SRC=47.102.157.109 DST=172.16.152.184
HOST_MANGLE_FORWARD IN=eth0 OUT=br0 MAC=.. SRC=47.102.157.109 DST=172.18.0.10
HOST_FILTER_FORWARD IN=eth0 OUT=br0 MAC=.. SRC=47.102.157.109 DST=172.18.0.10
HOST_MANGLE_POSTROUTING IN=eth0 OUT=br0 MAC=.. SRC=47.102.157.109 DST=172.18.0.10
HOST_NAT_POSTROUTING IN=eth0 OUT=br0 MAC=.. SRC=47.102.157.109 DST=172.18.0.10
```

为什么场景二配置OUTPUT chain，场景三配置PREROUTING chain？
场景二从本地进程发起网络请求，经过OUTPUT chain。场景三流量从NIC进入，经过PREROUTING chain。

## 其他

如何查看docker创建的network namespace？
ip netns命令只能查看链接到/run/netns目录的network namespace，有2种方式可以观察到docker创建的network namespace：

1. 通过nsenter命令在docker创建的network namespace中执行命令
2. 将network namespace文件链接到/run/netns目录

```bash
# 默认--network bridge
docker run -it -d alpine

# 查看container pid
pid=docker inspect -f '{{.State.Pid}}' ${container_id}

# nsenter -t <container_pid> -n <command>
# -n参数表示在network namespace种执行命令
nsenter -t $pid -n ip route
nsenter -t $pid -n ip addr
```

上面这个脚本的结果，和【宿主机和容器互通】一节中的配置相同，docker在宿主机创建了类型为bridge的docker0设备，类型为veth的vethxxx设备，容器通过docker0和vethxxx与宿主机互相访问。

```bash
pid=docker inspect -f '{{.State.Pid}}' ${container_id}

ln -s /proc/$pid/ns/net /run/netns/${container_id}

ip netns exec ${container_id} ip link
```

待学习内容：

1. ethernet（L2）和ip（L3）之间的联系区别？
2. bridge、switch、router之间的区别
   1. 为什么bridge不用ip地址就可以联通2个namespace？
3. lan、vlan、vxlan、macvlan之间的联系区别？

参考资料：

- https://labs.iximiuz.com/tutorials/container-networking-from-scratch
- https://iximiuz.com/en/posts/bridge-vs-switch/
- https://iximiuz.com/en/posts/laymans-iptables-101/
- https://serverfault.com/questions/171551/help-me-understand-the-ip-route-command-for-cisco-routers
- https://en.wikipedia.org/wiki/VLAN
- https://stackoverflow.com/questions/31265993/docker-networking-namespace-not-visible-in-ip-netns-list