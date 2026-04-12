FROM node:18-alpine

WORKDIR /app

COPY Https/ ./Https/

EXPOSE 3000

CMD ["node", "Https/main.js"]
