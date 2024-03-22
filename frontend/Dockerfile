# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory /app in the container
COPY package.json .
COPY package-lock.json .

# Install the application dependencies inside the container
RUN npm install

# Copy the rest of your application's source code from your local directory to the filesystem of the container
COPY . .

# Install serve to serve your app on Cloud Run
RUN npm install -g serve

# Build the app
RUN npm run build

# The command that starts your application
CMD ["serve", "-s", "dist", "-l", "8080"]