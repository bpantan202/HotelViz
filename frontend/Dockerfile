# Use the current node image as base
FROM node:alpine3.11

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

COPY . .

# Build the app
RUN npm run build || true

# Expose port 3000 on container
EXPOSE 3000

# Set host to localhost / the docker image
ENV NUXT_HOST=0.0.0.0

# Set app port
ENV NUXT_PORT=3000

# Start the app
CMD ["npm", "run","dev"]