# Use an official Nginx image as the base
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the application files to the Nginx HTML directory
# Assuming your app files (e.g., index.html) are in the 'app' folder in the same directory as the Dockerfile
COPY ./app /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 5173
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
