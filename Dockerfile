# Use the official nginx image as a base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your app files to the container
COPY . /usr/share/nginx/html

# Expose the port the app will run on
EXPOSE 5173

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
