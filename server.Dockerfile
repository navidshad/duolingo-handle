# Use a base image that supports ARM64
FROM node:18

# Set the working directory
WORKDIR /app

# Add your application files and dependencies
COPY ./server_app/package.json ./
RUN npm install --production

COPY ./server_app .

EXPOSE 8081

# Start your Node.js application
CMD ["npm", "run", "start"]
