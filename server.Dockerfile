# Use a base image that supports ARM64
FROM node:20-alpine3.17 as build-stage

# Set the working directory
WORKDIR /app

# Add your application files and dependencies
COPY ./server_app/package.json ./
RUN npm install

COPY ./server_app .

# Production stage
FROM arm64v8/node:18-alpine as production-stage
COPY --from=build-stage /app /app
EXPOSE 8081
WORKDIR /app
CMD ["npm", "run", "start"]