FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Nest dev server
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
