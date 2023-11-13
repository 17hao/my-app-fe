配置云服务器的一些脚本

OS Version: Debian 12

vim
```bash
#!/bin/bash

cat <<EOF > $HOME/.vimrc
set nu
set ts=4 sw=4
set hlsearch
syntax on

map <C-E> $
map <C-A> 0|
map! <C-E> <esc>A
map! <C-A> <esc>0i
EOF
```

v.2.r.a.y
```bash
https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh

vi install-release.sh
export LOCAL_INSTALL=1
export LOCAL_FILE=$HOME/v2ray-linux-64.zip

vi /usr/local/etc/v2ray/config.json
```

programming languages
```bash
#!/bin/bash

# go
wget -e use_proxy=yes -e https_proxy=http://127.0.0.1:8889 https://go.dev/dl/go1.20.11.linux-amd64.tar.gz

rm -rf /usr/local/go && tar -C /usr/local -xzf go1.20.11.linux-amd64.tar.gz

printf 'export PATH=$PATH:/usr/local/go/bin' >> $HOME/.bashrc
bash

go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct

rm -rf go1.20.11.linux-amd64.tar.gz

# python
sudo apt install python3 python3-pip python3-venv -y

# c
sudo apt install gcc gdb clang lldb -y
```

git
```bash
git config --global http.proxy http://127.0.0.1:8889
git config --global user.email sqh1107@gmail.com
git config --global user.name 17hao
git config --global core.editor vim
git config --global core.pager less -+X
```

docker
```bash
#!/bin/bash

# Uninstall older Docker version
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc;
do sudo apt-get remove -y $pkg;
done

# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker Engine
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

mysql
```bash
#!/bin/bash

export http_proxy="127.0.0.1:8889"

container_dir=/usr/local/container/mysql
sudo rm -rf $container_dir
sudo mkdir -p $container_dir/data
sudo mkdir -p $container_dir/conf

user=$(whoami)
sudo chown -R $user $container_dir
sudo chgrp -R $user $container_dir

cat <<EOF > $container_dir/conf/my.cnf
[mysqld]
skip-host-cache
skip-name-resolve
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
secure-file-priv=/var/lib/mysql-files
user=mysql
symbolic-links=0
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

# customized conf
log-bin=mysql-bin
server-id=1
character-set-server=utf8mb4
default-time-zone='+08:00'

[client]
socket=/var/run/mysqld/mysqld.sock

!includedir /etc/mysql/mysql.conf.d/
EOF

container_name="mysql-5.7"
docker stop $container_name
docker rm $container_name

docker run -d \
           -e MYSQL_ROOT_PASSWORD=123456 \
           --name=$container_name \
           -p 13306:3306 \
           -v $container_dir/data:/var/lib/mysql \
           -v $container_dir/conf:/etc/mysql/conf.d \
           mysql:5.7

docker ps --filter "name=$container_name" --filter "status=running"

cat <<EOF > $(pwd)/init-mysql-db
#!/bin/bash

docker exec $container_name mysql -uroot -p123456 -e "create user 'admin'@'%' identified by '123456'"
docker exec $container_name mysql -uroot -p123456 -e "grant all privileges on *.* to 'admin'@'%'"
docker exec $container_name mysql -uadmin -p123456 -e "create database my_db"
EOF

chmod 744 $(pwd)/init-mysql-db
# bash init-mysql-db
```

redis
```bash
#!/bin/bash

export http_proxy="127.0.0.1:8889"

container_dir=/usr/local/container/redis
sudo rm -rf $container_dir
sudo mkdir -p $container_dir/data
sudo mkdir -p $container_dir/conf

user=$(whoami)
sudo chown -R $user $container_dir
sudo chgrp -R $user $container_dir

container_name="redis-6.2"
docker stop $container_name
docker rm $container_name

cat <<EOF > $container_dir/conf/redis.conf
requirepass 123456
EOF

docker run -d \
           --name=$container_name \
           -p 16379:6379 \
           -v $container_dir/data:/data \
           -v $container_dir/conf:/usr/local/etc/redis \
           redis:6.2 \
           redis-server \
           /usr/local/etc/redis/redis.conf

docker ps --filter "name=$container_name" --filter "status=running"
```