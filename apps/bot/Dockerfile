# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy workspace files for npm workspaces resolution
COPY package*.json ./
COPY apps/bot/package*.json ./apps/bot/
COPY packages/shared/package*.json ./packages/shared/

# Install ALL dependencies (including dev for build)
RUN npm install -ws

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/bot/node_modules ./apps/bot/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY apps/bot/src ./apps/bot/src
COPY apps/bot/prisma ./apps/bot/prisma
COPY apps/bot/tsconfig.json ./apps/bot/
COPY apps/bot/package*.json ./apps/bot/
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/package*.json ./packages/shared/

# Build TypeScript
WORKDIR /app/apps/bot
RUN npx prisma generate
RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY apps/bot/package*.json ./apps/bot/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install --omit=dev -ws

# Copy built artifacts
COPY --from=builder /app/apps/bot/dist ./apps/bot/dist
COPY --from=builder /app/apps/bot/node_modules/.prisma ./apps/bot/node_modules/.prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the bot
CMD ["node", "apps/bot/dist/index.js"]