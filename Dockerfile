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

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts

# --- TAMBAHKAN INI ---
# Sesuaikan path-nya agar sesuai dengan yang ada di drizzle.config.ts
# Jika schema kamu ada di src/lib/server/db/schema.ts, maka copy foldernya:
COPY --from=builder --chown=node:node /app/src/lib/server/db ./src/lib/server/db

ENV NODE_ENV=production
ENV PORT=3000
USER node

CMD npx -y drizzle-kit@0.31.10 push && node build