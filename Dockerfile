# Start with NGINX base image
FROM nginx:latest

# Set the working directory (if needed)
WORKDIR /usr/share/nginx/html

# Copy your actual build directory (replace 'build' with your actual build folder)
COPY ./build /usr/share/nginx/html

# Copy custom NGINX configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose the service port (5173)
EXPOSE 5173  # Expose port 5173 for the application service (if needed)

# Expose NGINX port 80 to the outside world
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
