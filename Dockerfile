# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port (not necessary for this bot but good practice)
EXPOSE 3000

# Define the command to run the bot
CMD ["npm", "start"]
