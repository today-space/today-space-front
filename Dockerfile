# Use an official node runtime as a parent image
FROM node:14

# Install dependencies for building OpenSSL
RUN apt-get update && \
    apt-get install -y wget build-essential

# Download and install OpenSSL 1.0.2
RUN wget https://www.openssl.org/source/openssl-1.0.2u.tar.gz && \
    tar -xzf openssl-1.0.2u.tar.gz && \
    cd openssl-1.0.2u && \
    ./config --prefix=/usr/local/openssl-1.0.2u --openssldir=/usr/local/openssl-1.0.2u shared zlib && \
    make && \
    make install && \
    cd .. && \
    rm -rf openssl-1.0.2u openssl-1.0.2u.tar.gz && \
    ln -s /usr/local/openssl-1.0.2u/bin/openssl /usr/bin/openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Use nginx to serve the app
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
