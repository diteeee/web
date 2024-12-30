# Step 1: Use an official Node.js image
FROM node:16

# Step 2: Install build tools for compiling native dependencies like bcrypt
RUN apt-get update && apt-get install -y build-essential python3

# Step 3: Install nodemon globally if using it for development
RUN npm install -g nodemon

# Step 4: Set the working directory
WORKDIR /server

# Step 5: Copy package.json and package-lock.json (if available) and install dependencies
COPY package*.json ./

# Step 6: Install dependencies, including bcrypt
RUN npm install

# Step 7: Copy the rest of the application code
COPY . .

# Step 8: Expose the backend port (3001 in your case)
EXPOSE 3001

# Step 9: Define the command to start the app using nodemon or node
CMD ["npm", "start"]
