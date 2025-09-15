# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 👇 Copiamos el archivo de variables de entorno y lo renombramos a `.env`
COPY .env.prod .env

CMD ["node", "dist/main"]
