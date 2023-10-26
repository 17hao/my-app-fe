#!/bin/bash

docker build -t 17hao/my-app-fe .
# docker rmi $(docker images -f "dangling=true" -q)