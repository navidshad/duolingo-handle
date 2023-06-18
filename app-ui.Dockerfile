# simple docker file to build a vue app
# and serve it with nginx

# -------------------------------------
FROM node:18-alpine3.17 as build-stage

WORKDIR /app

COPY vue_src/package.json ./
COPY vue_src/yarn.lock ./
RUN yarn install

COPY vue_src .
RUN yarn build

# -------------------------------------
FROM nginx:1.17.8-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]