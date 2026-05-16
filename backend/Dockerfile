# ─── Build stage ───────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Runtime stage ─────────────────────────────────────────
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
# Run pending migrations on boot, then start the server.
CMD ["sh", "-c", "npx knex migrate:latest --knexfile ./knexfile.js && node server.js"]
