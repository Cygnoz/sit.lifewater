# Dockerfile for the Staff Microservice

# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:1.23-alpine

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
