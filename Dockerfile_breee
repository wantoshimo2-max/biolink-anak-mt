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

# Salin package json dan node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Salin seluruh isi app (termasuk src dan skema) 
# tapi abaikan yang tidak perlu lewat .dockerignore
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/seed-db.ts ./seed-db.ts

# Opsional: Jika kamu pakai folder migrations, salin juga
# COPY --from=builder /app/drizzle ./drizzle 

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx drizzle-kit push --force && npx tsx seed-db.ts && node build"]
#