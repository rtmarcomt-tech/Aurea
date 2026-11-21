FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/aurea?schema=public"
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start -- --hostname 0.0.0.0"]
