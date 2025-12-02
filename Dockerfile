# Use Node.js 14 LTS
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY client/package.json ./client/

# Install server dependencies
RUN npm install --no-package-lock --production

# Install client dependencies
WORKDIR /app/client
RUN npm install --no-package-lock

# Copy all source code
WORKDIR /app
COPY . .

# Build the React client
WORKDIR /app/client
RUN npm run build

# Switch back to app directory
WORKDIR /app

# Expose port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]