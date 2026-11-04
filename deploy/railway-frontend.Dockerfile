FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
ENV HOST=0.0.0.0
WORKDIR /app

COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node frontend/server.cjs ./server.cjs

USER node
EXPOSE 4173
CMD ["node", "server.cjs"]
