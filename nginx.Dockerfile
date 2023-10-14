FROM arm64v8/nginx

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
