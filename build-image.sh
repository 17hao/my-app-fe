#!/bin/bash

npm run build

docker build --network=host -t 17hao/my-app-fe .
