# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (using pnpm if lockfile exists, otherwise npm)
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; else npm install; fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Re-install only production dependencies
RUN npm install --omit=dev

EXPOSE 5000

CMD ["npm", "start"]
