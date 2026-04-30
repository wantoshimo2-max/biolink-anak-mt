# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy built application and dependencies, setting ownership to 'node'
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json
# Tambahkan kembali file ini (PENTING!)
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=node:node /app/src/lib/server/db ./src/lib/server/db
COPY --from=builder --chown=node:node /app/debug-db.js ./debug-db.js

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Switch to non-root user
USER node

# Start the application with debug test and push
CMD ["sh", "-c", "node debug-db.js && npx drizzle-kit push --force && node build"]
