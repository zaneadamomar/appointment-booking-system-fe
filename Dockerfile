# ==========================================================
# DEVELOPMENT
# ==========================================================

FROM node:20-alpine

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Next.js development server
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "dev"]