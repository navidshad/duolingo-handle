# Write a simple docker file that runs a node server for arm64
FROM node:18

# Install python
RUN apt-get update && apt-get install -y python3 python3-pip

# Install make and build tools make g++ libc-dev
RUN apt-get install -y build-essential

WORKDIR /app
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN yarn install

COPY ./server_app .

EXPOSE 8081
CMD ["yarn", "start"]
