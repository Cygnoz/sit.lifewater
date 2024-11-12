# Stage 1: Build the application using Node.js
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install aws-sdk if needed (optional if your code uses AWS services)
RUN npm install aws-sdk

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the built files using Nginx
FROM nginx:alpine

# Copy built files from the build stage to the Nginx web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optionally copy a custom Nginx configuration (remove if not needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which Nginx runs
EXPOSE 5173

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
