# Write a simple docker file that runs a node server
FROM node:18-alpine

# Install python
RUN apk add --no-cache python3

WORKDIR /app
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN yarn install

COPY ./server_app .

EXPOSE 8081
CMD ["yarn", "start"]
