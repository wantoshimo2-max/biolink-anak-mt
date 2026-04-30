# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies terlebih dahulu (untuk caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build aplikasi SvelteKit
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner

WORKDIR /app

# Copy hasil build dan file yang diperlukan dari stage builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./

# Set environment variable untuk production
ENV NODE_ENV=production

# Expose port (SvelteKit default biasanya 3000 atau sesuai konfigurasi adapter-node)
EXPOSE 3000

USER node

# Jalankan migrasi/push sebelum menjalankan aplikasi
# Pastikan DB_URL sudah ada di environment variables saat container running
CMD npx drizzle-kit push && node build