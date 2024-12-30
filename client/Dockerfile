# Step 1: Use Node.js image to build the React app
FROM node:16 AS build

WORKDIR /client
COPY package.json package-lock.json /client/
RUN npm install

COPY . /client
RUN npm run build

# Step 2: Use Nginx to serve the built app
FROM nginx:alpine

# Step 3: Copy the Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Debug the Nginx config (optional)
RUN ls -l /etc/nginx/

# Step 4: Copy the built React app into the Nginx container
COPY --from=build /client/build /usr/share/nginx/html

# Expose port 80 for serving the app
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
