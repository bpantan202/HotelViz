# Use Node v17 as the base image.
FROM node:17-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

RUN npm run build || true

# Copy the rest of the application code
COPY . .
# Expose the port that our server will run on
EXPOSE 5001
# Run our app
CMD ["node", "/app/server.js"]