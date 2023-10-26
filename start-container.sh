#!/bin/bash

docker stop my-app-fe

docker rm my-app-fe

docker rmi $(docker images -f "dangling=true" -q)

docker run --name my-app-fe -d -p 80:80 17hao/my-app-fe

