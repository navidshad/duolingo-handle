FROM arm64v8/nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
