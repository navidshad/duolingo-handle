#!/bin/bash

# This script is used to run nginx in a docker container

NGINX_CONTAINER_NAME="nginx"

docker stop $NGINX_CONTAINER_NAME >/dev/null
docker rm $NGINX_CONTAINER_NAME >/dev/null

# run the container
# Path: nginx.conf
docker run -d -p 80:80 --name $NGINX_CONTAINER_NAME -v /nginx:/etc/nginx:ro nginx

# copy the nginx.conf file to the container
# docker cp nginx.conf $NGINX_CONTAINER_NAME:/etc/nginx/nginx.conf

# reload the nginx configuration
# docker exec $NGINX_CONTAINER_NAME nginx -s reload
