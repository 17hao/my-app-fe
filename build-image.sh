#!/bin/bash

npm run build

docker stop my-app-fe
docker rm my-app-fe
docker build --network=host -t 17hao/my-app-fe .
docker rmi $(docker images -qa -f 'dangling=true')
