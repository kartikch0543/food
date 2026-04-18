# Use the official Node.js image.
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the API port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
