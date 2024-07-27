# Base image with yum package manager
FROM centos:7 as base

# Install node and compat-openssl10
RUN yum install -y epel-release && \
    curl -sL https://rpm.nodesource.com/setup_14.x | bash - && \
    yum install -y nodejs && \
    yum install -y compat-openssl10

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

# Copy the build directory from the previous stage
COPY --from=base /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
