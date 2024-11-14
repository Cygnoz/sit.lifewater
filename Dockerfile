# Use the official Nginx image
FROM nginx:latest

# Set the working directory to Nginx's HTML directory
WORKDIR /usr/share/nginx/html

# Copy the build output (dist folder) from the local system to the container's Nginx directory
# The dist folder is created after running "npm run build"
COPY ./dist /usr/share/nginx/html

# Copy the custom Nginx configuration (nginx.conf) to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 5173
EXPOSE 5173

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
