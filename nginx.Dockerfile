FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
