# Dockerfile for Staff service
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5173
CMD ["npm", "start"]
