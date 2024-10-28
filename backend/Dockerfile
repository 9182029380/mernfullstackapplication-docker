# Backend Dockerfile

# Use Node.js LTS image as the base image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies within the Docker environment
RUN npm install

# Copy the application code
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Expose the port
EXPOSE 5000

# Command to start the server
CMD ["npm", "run", "start"]
