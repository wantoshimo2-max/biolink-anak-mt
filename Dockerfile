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

# Ambil file yang dibutuhkan
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json
# Copy config drizzle supaya bisa dibaca saat start
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts

ENV NODE_ENV=production
ENV PORT=3000
USER node

# JALUR AMAN: Panggil binari langsung, baru jalankan app
CMD ./node_modules/.bin/drizzle-kit push && node build
