# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configs
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN npm --prefix server install --omit=dev
RUN npm --prefix client install

# Copy source
COPY client ./client
COPY server ./server

# Build frontend
RUN npm --prefix client run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV CLIENT_ORIGIN=*

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/package.json ./

EXPOSE 5000

CMD ["node", "server/src/index.js"]
