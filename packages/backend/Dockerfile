FROM node:18-alpine
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY packages/backend/package*.json ./packages/backend/

# Copy prisma schema
COPY packages/backend/prisma ./packages/backend/prisma/

# Install dependencies (including Prisma client generation trigger)
RUN npm install

# Copy the rest of the source code
# Ensure we copy relative to the root context
COPY packages/backend/ ./packages/backend/

# Generate Prisma client explicitly (good practice)
RUN npx prisma generate --schema=./packages/backend/prisma/schema.prisma

# Build TypeScript code (assuming a build script exists)
# If no build step is needed (e.g., using ts-node directly), remove this line
# RUN npm run build --workspace=backend
# Let's assume you'll run with ts-node for simplicity in dev Docker, requires ts-node in dependencies
# If using compiled JS, adjust CMD below

EXPOSE 3001

# Run migrations and start the server using ts-node
# Ensure 'ts-node' and 'nodemon' (optional) are in devDependencies
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./packages/backend/prisma/schema.prisma && npx ts-node ./packages/backend/src/index.ts"]

# Alternative CMD if you have a build step:
# CMD ["sh", "-c", "npx prisma migrate deploy --schema=./packages/backend/prisma/schema.prisma && node ./packages/backend/dist/index.js"]