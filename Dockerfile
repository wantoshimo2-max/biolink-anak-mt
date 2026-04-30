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

# Remove development dependencies (Drizzle aman karena sudah dipindah ke dependencies)
RUN npm prune --production


# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json

# --- TAMBAHAN: Copy file config drizzle agar bisa dibaca saat push ---
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Switch to non-root user
USER node

# Tambahkan flag -y agar tidak minta konfirmasi (y/n) dan tentukan versinya
CMD npx -y drizzle-kit@0.31.10 push && node build