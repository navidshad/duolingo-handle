# Use a base image that supports ARM64
FROM arm64v8/ubuntu:20.04

# Install essential packages and Node.js 18
RUN apt-get update && \
	apt-get install -y curl git && \
	curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
	apt-get install -y nodejs

# Install Python and pip
RUN apt-get install -y python3 python3-pip && \
	ln -s /usr/bin/python3 /usr/bin/python && \
	ln -s /usr/bin/pip3 /usr/bin/pip

# Verify Node.js and Python installations
RUN node -v && npm -v && python -V && pip --version

# Set the working directory
WORKDIR /app

# Add your application files and dependencies
COPY ./server_app/package.json ./server_app/yarn.lock ./
RUN npm install

COPY ./server_app .

EXPOSE 8081

# Start your Node.js application
CMD ["npm", "run", "start"]
