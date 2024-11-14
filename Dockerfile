# Start with NGINX base image
FROM nginx:latest

# Set the working directory (if needed)
WORKDIR /usr/share/nginx/html

# Copy your application build (static files) to the container's NGINX directory
# Replace "your-build-directory" with the actual path to your app build (like dist/ or build/)
COPY ./your-build-directory /usr/share/nginx/html

# Copy custom NGINX configuration file (the one with proxy to port 5173)
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose the service port (5173)
EXPOSE 5173  # Expose port 5173 for the application service (if needed)

# Expose NGINX port 80 to the outside world (for reverse proxy)
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
