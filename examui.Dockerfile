# Simple docker file to build a vue app
# and serve it with nginx

# -------------------------------------
FROM node:18-alpine3.17 as build-stage

WORKDIR /app

COPY ./ui_app/package.json ./
COPY ./ui_app/yarn.lock ./
RUN yarn install

COPY ./ui_app .
RUN yarn build

# -------------------------------------
FROM arm64v8/nginx:1.25.4 as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80