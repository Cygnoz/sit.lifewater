# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Set up Nginx server
FROM nginx:stable-alpine

# Copy nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 5173
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

