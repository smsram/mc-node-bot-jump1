# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (useful if your bot interacts with an HTTP server)
EXPOSE 3000

# Define the command to run the bot
CMD ["npm", "start"]
