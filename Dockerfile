# Dockerfile for a Node.js application with Nginx as a reverse proxy

# Stage 1: Build the Node.js application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Build the application (if applicable, for React or Next.js)
RUN npm run build

# Expose the port your app runs on (e.g., 5173 for Node.js app)
EXPOSE 5173

# Stage 2: Set up Nginx
FROM nginx:latest

# Copy Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application code from the builder stage (for static sites)
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Copy Node.js app into the image (for backend apps)
COPY --from=builder /usr/src/app /usr/src/app

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
