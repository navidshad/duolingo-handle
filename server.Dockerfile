# Use a base image that supports ARM64
FROM arm64v8/node:20-alpine3.17

# Set the working directory
WORKDIR /app

# Add your application files and dependencies
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN yarn --verion
RUN yarn install --production

COPY ./server_app .

EXPOSE 8081

# Start your Node.js application
CMD ["npm", "run", "start"]
