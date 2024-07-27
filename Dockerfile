# Use an official node runtime as a parent image
FROM node:14

# Install compat-openssl10
RUN apt-get update && \
    apt-get install -y wget && \
    wget http://mirror.centos.org/centos/7/os/x86_64/Packages/compat-openssl10-1.0.2o-3.el7.x86_64.rpm && \
    apt-get install -y alien && \
    alien -i compat-openssl10-1.0.2o-3.el7.x86_64.rpm && \
    rm compat-openssl10-1.0.2o-3.el7.x86_64.rpm && \
    apt-get clean

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
