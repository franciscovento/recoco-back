# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env.docker ./

# Generate Prisma files
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 4000

# Start the server using the production build
CMD ["sh", "-c", "sleep 10 && npx prisma migrate deploy && npm run start"]
# CMD ["npm", "run", "start"]
