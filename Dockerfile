# Use the official Nginx image
FROM nginx:latest

# Set the working directory to Nginx's HTML directory
WORKDIR /usr/share/nginx/html

# Copy the build output (dist folder) from your local system to the container
COPY ./dist /usr/share/nginx/html

# Copy the custom Nginx configuration (nginx.conf)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 5173 (instead of the default 80)
EXPOSE 5173

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
