# Use the NGINX base image
FROM nginx:alpine

# Set the working directory to NGINX's default HTML directory
WORKDIR /usr/share/nginx/html

# Copy the contents of the 'public' folder (or a different folder as needed)
COPY ./public /usr/share/nginx/html

# Copy the NGINX configuration file (assuming you want to modify the port)
COPY ./nginx.conf /etc/nginx/nginx.conf
