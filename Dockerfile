# ── Stage 1: Build Application ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for Vite build)
RUN npm ci

# Copy frontend source code and configs
COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# Build argument for API base URL (defaults to /api so Nginx reverse-proxies seamlessly)
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Build optimized production bundle
RUN npm run build

# ── Stage 2: Production Nginx Server ─────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
