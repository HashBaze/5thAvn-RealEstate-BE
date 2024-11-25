# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built JavaScript files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app will run on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "dist/server.js"]