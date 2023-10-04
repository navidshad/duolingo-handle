# Write a simple docker file that runs a node server for arm64
FROM node:18

# Install python
RUN apk add --no-cache python3

# Install make and build tools
RUN apk add --no-cache make g++ libc-dev

WORKDIR /app
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN yarn install

COPY ./server_app .

EXPOSE 8081
CMD ["yarn", "start"]
