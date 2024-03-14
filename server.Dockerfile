# Build Product Website
FROM node:20-alpine3.17 as build-product-stage
WORKDIR /product
COPY ./product_website/package.json ./
RUN yarn install
COPY ./product_website .
RUN yarn run build

# Build Admin App
FROM node:20-alpine3.17 as build-admin-stage
WORKDIR /admin
COPY ./admin_app/package.json ./
RUN yarn install
COPY ./admin_app .
RUN yarn run build

# Setup server app
FROM node:20-alpine3.17 as build-server-stage
WORKDIR /app
COPY ./server_app/package.json ./
RUN npm install
COPY ./server_app .

# Copy admin app to server app
WORKDIR /
COPY --from=build-product-stage /product/dist ./app/public
COPY --from=build-admin-stage /admin/dist ./app/public/admin
RUN rm -rf /admin

# Production stage
FROM arm64v8/node:18-alpine as production-stage
COPY --from=build-server-stage /app /app
EXPOSE 8081
WORKDIR /app
CMD ["npm", "run", "start"]