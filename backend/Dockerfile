# Use Node.js LTS version
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set proper permissions for node_modules binaries
RUN chmod +x ./node_modules/.bin/tsc
RUN chmod +x ./node_modules/.bin/ts-node

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from build stage
COPY --from=base /app/dist ./dist

# Expose the port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "dist/index.js"]