#!/bin/bash

# This script is used to run nginx in a docker container

NGINX_CONTAINER_NAME="nginx"

docker stop $NGINX_CONTAINER_NAME >/dev/null
docker rm $NGINX_CONTAINER_NAME >/dev/null

# run the container
# Path: nginx.conf
docker run -d -p 80:80 --name $NGINX_CONTAINER_NAME -v /nginx.conf:/etc/nginx/nginx.conf:ro nginx
