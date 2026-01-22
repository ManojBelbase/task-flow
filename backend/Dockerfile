# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

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

WORKDIR /usr/src/app

# Copy built assets and production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml* ./

# Re-install only production dependencies
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod; else npm install --omit=dev; fi

EXPOSE 5000

CMD ["npm", "start"]
