FROM node:18-alpine

WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install --prefix ./Express

# Expose HTTP port
EXPOSE 3000

# Start the application
CMD ["node", "Express/main.js"]
