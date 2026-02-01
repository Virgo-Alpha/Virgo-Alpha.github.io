# Use Node.js LTS
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy local code to the container image.
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose port 8080
EXPOSE 8080

# Start the server
CMD [ "node", "server.js" ]
