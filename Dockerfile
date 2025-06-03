# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Use .dockerignore to avoid copying node_modules, etc.
# Set NODE_ENV for production
ENV NODE_ENV=production

# Copy only necessary files for dependencies install
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Copy environment file for Docker/Render
COPY .env.docker .env

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 4000

# Run migrations and start app (Render runs CMD directly)
CMD npx prisma migrate deploy && npm run start
