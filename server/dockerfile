# Step 1: Use an official Node.js image
FROM node:16

# Step 2: Install build tools for compiling native dependencies like bcrypt
RUN apt-get update && apt-get install -y build-essential python3

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy package.json and package-lock.json (if available) and install dependencies
COPY package*.json ./

# Step 5: Install dependencies, including bcrypt
RUN npm install

# Step 6: Copy the rest of the application code
COPY . .

# Step 7: Expose the backend port (3001 in your case)
EXPOSE 3001

# Step 8: Define the command to start the app
CMD ["npm", "start"]
