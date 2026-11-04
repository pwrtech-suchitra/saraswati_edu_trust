FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --omit=dev --prefix backend && npm cache clean --force

COPY backend/src ./backend/src
COPY backend/scripts ./backend/scripts
COPY database ./database
COPY deploy/seed-roles.js ./deploy/seed-roles.js
COPY deploy/railway-migrate.cjs ./deploy/railway-migrate.cjs

RUN mkdir -p /app/backend/uploads && chown -R node:node /app/backend
USER node

EXPOSE 5000
CMD ["node", "backend/src/server.js"]