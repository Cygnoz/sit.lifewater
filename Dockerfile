# Stage 1: Build the Node.js application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Build the application (if using a frontend framework like React or Vite)
RUN npm run build

# Expose the port your app runs on
EXPOSE 5173

# Start the Node.js application
CMD ["npm", "run", "dev"]


# Stage 2: Set up Nginx
FROM nginx:latest

# Copy Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application code from the builder stage (if serving static files)
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

