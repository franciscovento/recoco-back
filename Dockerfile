FROM node:18-slim

# Instalar dependencias del sistema (OpenSSL)
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]