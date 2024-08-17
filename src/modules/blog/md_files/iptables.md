iptables用于控制Linux内核ip table规则，可以过滤、修改ip数据包。

## Table of Contents

## 概念解释

table
iptables一共有5张表，分别是：

1. filter：过滤ip数据包
2. raw：
3. nat：
4. mangle：
5. security：

chain
网络数据包在table中经过多个阶段的处理，包括prerouting、forward、postrouting等等，chain描述的就是一个阶段。

rule
rule表示数据包需要满足的条件，例如来源、协议等等。一个chain中可以包含若干个rule，数据包经过一个chain时，依次匹配rule，直到不匹配时停止。
通过`iptables -L`命令可以查看chain和对应的rule，默认查看filter表。

target
target表示当数据包满足一条rule时，执行的动作，一个rule可以对应（？）个target。iptables提供了内置的3种target以及多种插件。内置的target有ACCEPT、DROP、RETURN，插件可通过`man iptables-extensions`查看，常用的有LOG等。

policy
policy表示chain兜底的策略，是一种特殊的target，当数据包未匹配任何rule或者某一条rule的target为RETURN，数据包的处理策略为chain指定的policy。
policy的值为ACCEPT或DROP二选一。

## 数据包的路径

```
https://cloud.githubusercontent.com/assets/1711674/8742352/87da5f4e-2c32-11e5-8a90-25fc6158e2a3.png

[chain]
<table>

NIC --[PREROUTING]-> ROUTING ------[FORWARD]-----------------[POSTROUTING]--> NIC
         <raw>          |             <mangle>                   |  <mangle>
         <mangle>       |             <filter>                   |  <nat(src)>
         <nat(dst)>        |             <security>                 |  
                        |                                        |   
                        +-[INPUT]-> Local Process -- ROUTING -->[OUTPUT]
                             <filter>                              <raw>
                             <mangle>                              <mangle>
                             <security>                            <nat(dst)>
                                                                   <filter>
                                                                   <security>
```

数据包的流转路径可以分3种情况：

1. 流量从本地进程流向NIC
2. 流量从NIC进入
   1. 不经过本地进程转发到NIC
   2. 流向本地进程

几个值得注意的点：

1. 每个chain按从上向下的顺序过不同的table
2. nat表分为dst（DNAT）和src（SNAT），分别修改dst、src IP地址
3. nat表以连接为单位，也就是每个连接只有第一个包会经过nat
4. raw表只有PREROUTING、OUTPUT 2个chain，并且作用于connection track之前，用于判断是否需要处理NIC或本地进程流入的流量

## 实验环节

实验方式：通过创建network namespace模拟通过路由器访问互联网。

实验目的：

1. 学习基础的iptables使用方法
2. 观察数据包的流向

配置网络环境：

```bash
#!/bin/bash

ip netns add netns0

ip link add vHOST type veth peer name vGUEST netns netns0
ip link add br0 type bridge
ip addr add 172.16.0.1/16 dev br0
ip link set vHOST master br0
ip link set vHOST up
ip link set br0 up

# 使host成为virtual router
# 原理是什么？
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# 用途是什么？
echo 1 > /proc/sys/net/ipv4/ip_forward
# 启用netfilter打印子network namespace日志功能
echo 1 > /proc/sys/net/netfilter/nf_log_all_netns

nsenter --net=/run/netns/netns0

# 以下操作在子network namespace完成
ip addr add 172.16.0.2/16 dev vGUEST
ip route add default via 172.16.0.1
ip link set vGUEST up
```

配置iptables，在子network namespace中执行：

```bash
#!/bin/bash

iptables -t filter -A INPUT -j LOG --log-prefix "NETNS_FILTER_INPUT "
iptables -t filter -A FORWARD -j LOG --log-prefix "NETNS_FILTER_FORWARD "
iptables -t filter -A OUTPUT -j LOG --log-prefix "NETNS_FILTER_OUTPUT "

iptables -t nat -A PREROUTING -j LOG --log-prefix "NETNS_NAT_PREROUTING "
iptables -t nat -A INPUT -j LOG --log-prefix "NETNS_NAT_INPUT "
iptables -t nat -A OUTPUT -j LOG --log-prefix "NETNS_NAT_OUTPUT "
iptables -t nat -A POSTROUTING -j LOG --log-prefix "NETNS_NAT_POSTROUTING "

iptables -t mangle -A PREROUTING -j LOG --log-prefix "NETNS_MANGLE_PREROUTING "
iptables -t mangle -A INPUT -j LOG --log-prefix "NETNS_MANGLE_INPUT "
iptables -t mangle -A FORWARD -j LOG --log-prefix "NETNS_MANGLE_FORWARD "
iptables -t mangle -A OUTPUT -j LOG --log-prefix "NETNS_MANGLE_OUTPUT "
iptables -t mangle -A POSTROUTING -j LOG --log-prefix "NETNS_MANGLE_POSTROUTING "

iptables -t raw -A PREROUTING -j LOG --log-prefix "NETNS_RAW_PREROUTING "
iptables -t raw -A OUTPUT -j LOG --log-prefix "NETNS_RAW_OUTPUT "
```

配置iptables，在根network namespace种执行：

```bash
#!/bin/bash

iptables -t filter -A INPUT -j LOG --log-prefix "HOST_FILTER_INPUT "
iptables -t filter -A FORWARD -j LOG --log-prefix "HOST_FILTER_FORWARD "
iptables -t filter -A OUTPUT -j LOG --log-prefix "HOST_FILTER_OUTPUT "

iptables -t nat -A PREROUTING -j LOG --log-prefix "HOST_NAT_PREROUTING "
iptables -t nat -A INPUT -j LOG --log-prefix "HOST_NAT_INPUT "
iptables -t nat -A OUTPUT -j LOG --log-prefix "HOST_NAT_OUTPUT "
iptables -t nat -A POSTROUTING -j LOG --log-prefix "HOST_NAT_POSTROUTING "

iptables -t mangle -A PREROUTING -j LOG --log-prefix "HOST_MANGLE_PREROUTING "
iptables -t mangle -A INPUT -j LOG --log-prefix "HOST_MANGLE_INPUT "
iptables -t mangle -A FORWARD -j LOG --log-prefix "HOST_MANGLE_FORWARD "
iptables -t mangle -A OUTPUT -j LOG --log-prefix "HOST_MANGLE_OUTPUT "
iptables -t mangle -A POSTROUTING -j LOG --log-prefix "HOST_MANGLE_POSTROUTING "

iptables -t raw -A PREROUTING -j LOG --log-prefix "HOST_RAW_PREROUTING "
iptables -t raw -A OUTPUT -j LOG --log-prefix "HOST_RAW_OUTPUT "
```

在子network namespace中执行`ping -c 2 8.8.8.8`，在host中执行`ag 8.8.8.8 /var/log/syslog`查看日志。

删除头尾、mac地址后的日志如下（nat表日志未列出，每个连接只有第一个包会经过nat表）。

```text
# 流量从本地进程流向NIC
NETNS_RAW_OUTPUT IN= OUT=vGUEST SRC=172.16.0.2 DST=8.8.8.8
NETNS_MANGLE_OUTPUT IN= OUT=vGUEST SRC=172.16.0.2 DST=8.8.8.8
NETNS_FILTER_OUTPUT IN= OUT=vGUEST SRC=172.16.0.2 DST=8.8.8.8
NETNS_MANGLE_POSTROUTING IN= OUT=vGUEST SRC=172.16.0.2 DST=8.8.8.8

# 流量从NIC流向另一个NIC
HOST_RAW_PREROUTING IN=br0 OUT= SRC=172.16.0.2 DST=8.8.8.8
HOST_MANGLE_PREROUTING IN=br0 OUT= SRC=172.16.0.2 DST=8.8.8.8
HOST_MANGLE_FORWARD IN=br0 OUT=eth0 SRC=172.16.0.2 DST=8.8.8.8
HOST_FILTER_FORWARD IN=br0 OUT=eth0 SRC=172.16.0.2 DST=8.8.8.8
HOST_MANGLE_POSTROUTING IN=br0 OUT=eth0 SRC=172.16.0.2 DST=8.8.8.8

# 流量从NIC流向另一个NIC
HOST_RAW_PREROUTING IN=eth0 OUT= SRC=8.8.8.8 DST=172.16.152.184
HOST_MANGLE_PREROUTING IN=eth0 OUT= SRC=8.8.8.8 DST=172.16.152.184
HOST_MANGLE_FORWARD IN=eth0 OUT=br0 SRC=8.8.8.8 DST=172.16.0.2
HOST_FILTER_FORWARD IN=eth0 OUT=br0 SRC=8.8.8.8 DST=172.16.0.2
HOST_MANGLE_POSTROUTING IN=eth0 OUT=br0 SRC=8.8.8.8 DST=172.16.0.2

# 流量从NIC流向本地进程
NETNS_RAW_PREROUTING IN=vGUEST OUT= SRC=8.8.8.8 DST=172.16.0.2
NETNS_MANGLE_PREROUTING IN=vGUEST OUT= SRC=8.8.8.8 DST=172.16.0.2
NETNS_MANGLE_INPUT IN=vGUEST OUT= SRC=8.8.8.8 DST=172.16.0.2
NETNS_FILTER_INPUT IN=vGUEST OUT= SRC=8.8.8.8 DST=172.16.0.2
```

参考资料

- https://iximiuz.com/en/posts/laymans-iptables-101/
- https://www.frozentux.net/iptables-tutorial/iptables-tutorial.html#TRAVERSINGOFTABLES
- https://inai.de/images/nf-packet-flow.png