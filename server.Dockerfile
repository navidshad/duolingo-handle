# Write a simple docker file that runs a node server for arm64
FROM arm64v8/buildpack-deps:stable

WORKDIR /app
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN yarn install

COPY ./server_app .

EXPOSE 8081
CMD ["yarn", "start"]
