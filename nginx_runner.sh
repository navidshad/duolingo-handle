#!/bin/bash

# This script is used to run nginx in a docker container

# install "grep" if it is not installed
if ! [ -x "$(command -v grep)" ]; then
	sudo yum install -y grep
fi

$NGINX_CONTAINER_NAME = "nginx"
$IS_NGINX_RUNNING = $(docker ps -a | grep $NGINX_CONTAINER_NAME)

# stop and remove the container if it is already running
if [ -n "$IS_NGINX_RUNNING" ]; then
	docker stop $NGINX_CONTAINER_NAME
	docker rm $NGINX_CONTAINER_NAME
fi

# run the container
# Path: nginx.conf
docker run -d -p 80:80 --name $NGINX_CONTAINER_NAME -v /nginx.conf:/etc/nginx/nginx.conf:ro nginx

echo "nginx is running on port 80 in a docker container"
