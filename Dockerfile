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

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Sesuaikan folder ini dengan lokasi file skema Drizzle kamu
# Jika foldernya ada di src/lib/db, ganti menjadi: COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/drizzle ./drizzle 
COPY --from=builder /app/drizzle.config.ts ./

ENV NODE_ENV=production

EXPOSE 3000

# Menggunakan format JSON (Exec form) untuk CMD sesuai saran log error kamu
# Kita bungkus dalam shell agar bisa menjalankan dua perintah sekaligus
CMD ["sh", "-c", "npx drizzle-kit push && node build"]