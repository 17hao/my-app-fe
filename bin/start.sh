#!/bin/bash

if ! command -v pm2 &> /dev/null; then
	npm install pm2 -g
fi

pm2 start npm --name blog -- start
