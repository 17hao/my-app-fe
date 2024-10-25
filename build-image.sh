#!/bin/bash

export https_proxy=http://127.0.0.1:8889

docker stop my-app-fe

docker rm my-app-fe

docker build --network=host -t 17hao/my-app-fe .

docker rmi $(docker images -qa -f 'dangling=true')
