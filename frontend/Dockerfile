# Frontend Dockerfile

# Use Node.js LTS image as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Build the React application
RUN npm run build

# Expose the frontend port (default for React apps is 3000)
EXPOSE 3000

# Serve the app with a web server like serve or directly from npm
CMD ["npx", "serve", "-s", "build"]
