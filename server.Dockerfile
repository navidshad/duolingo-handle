# Use a base image that supports ARM64
FROM node:20-alpine3.17 as build-admin-stage
WORKDIR /admin
COPY ./admin_app/package.json ./
RUN npm install
COPY ./admin_app .
RUN npm run build

# Setup server app
FROM node:20-alpine3.17 as build-server-stage
WORKDIR /app
COPY ./server_app/package.json ./
RUN npm install
COPY ./server_app .

# Copy admin app to server app
WORKDIR /
COPY --from=build-admin-stage /admin/dist ./app/public
RUN rm -rf /admin

# Production stage
FROM arm64v8/node:18-alpine as production-stage
COPY --from=build-stage /app /app
EXPOSE 8081
WORKDIR /app
CMD ["npm", "run", "start"]