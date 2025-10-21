# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY packages/frontend/package*.json ./packages/frontend/
RUN npm install

# Copy the rest of the monorepo source (needed for potential shared libs/types)
COPY . .

# Build the frontend application within its workspace
RUN npm run build --workspace=frontend

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/packages/frontend/dist .

# Copy custom nginx configuration
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]