#!/usr/bin/env bash

source ./build-image.sh

docker stop my-app-fe

docker rm my-app-fe

docker rmi $(docker images -f "dangling=true" -q)

# docker network create --driver=bridge --subnet=192.168.100.0/24 nginx
docker run --name my-app-fe -d --network=nginx -p 3000:3000 17hao/my-app-fe
