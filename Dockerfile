# Step 1: Use a Node.js image to build the application
FROM node:16 as build-stage

# Set the working directory for the build stage
WORKDIR /app

# Copy the package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install the npm dependencies
RUN npm install

# Copy the entire project (including source code) into the container
COPY . .

# Run the build command (this will generate the dist folder)
RUN npm run build

# Step 2: Use the Nginx image to serve the built application
FROM nginx:latest

# Set the working directory for Nginx to serve the app
WORKDIR /usr/share/nginx/html

# Copy the build output (dist folder) from the build stage to the Nginx container
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration (nginx.conf) into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port on which Nginx will listen
EXPOSE 5173

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
