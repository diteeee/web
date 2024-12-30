# Step 1: Use an official Node.js image (to build React app)
FROM node:16 AS build

# Step 2: Set the working directory
WORKDIR /client

# Step 3: Copy package.json and package-lock.json (if available) and install dependencies
# Copy package.json and package-lock.json to the container
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the application code
# Copy the rest of the app's code
COPY . .

# Step 5: Build the React app
RUN npm run build

# Step 6: Use Nginx to serve the built app
FROM nginx:alpine

# Step 7: Copy the custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Step 8: Copy the built React app into the Nginx container
COPY --from=build /client/build /usr/share/nginx/html

# Step 9: Expose port 80 for Nginx
EXPOSE 80

# Step 10: Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
