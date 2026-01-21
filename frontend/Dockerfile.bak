# Build stage (simplified for now as frontend is empty)
FROM node:20-alpine AS builder

WORKDIR /app

# Initializing a basic frontend would happen here
# For now, we assume a standard build output
# In a real scenario, we'd copy package.json and src

# COPY package.json pnpm-lock.yaml* ./
# RUN npm install
# COPY . .
# RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build output to nginx (placeholder index.html)
RUN echo "<h1>TaskFlow Frontend Placeholder</h1>" > /usr/share/nginx/html/index.html

# COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
