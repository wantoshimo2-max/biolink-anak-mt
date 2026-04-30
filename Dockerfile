# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
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

# Salin hasil build dan dependencies
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Salin config dan folder schema (PENTING untuk db:push)
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=node:node /app/src/lib/server/db ./src/lib/server/db

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Standar port aplikasi
EXPOSE 3000

# Gunakan user non-root untuk keamanan
USER node

# Jalankan push menggunakan script yang sudah ada di package.json kemudian start
CMD ["sh", "-c", "npm run db:push && node build"]