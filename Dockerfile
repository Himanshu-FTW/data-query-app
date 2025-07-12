# Multi-stage build for the entire application
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Build stage for frontend
FROM base AS frontend-build
WORKDIR /app/client
COPY client/ .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/client/build ./client/build

# Copy server files
COPY server/ ./server/

# Copy root package.json
COPY package*.json ./

# Install only production dependencies for server
RUN cd server && npm ci --only=production

# Create uploads directory with proper permissions
RUN mkdir -p server/uploads && chown -R nodejs:nodejs server/uploads && chmod 755 server/uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"] 