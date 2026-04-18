FROM node:18-alpine

WORKDIR /app

COPY Https/ ./Https/
#port 
EXPOSE 3000

CMD ["node", "Https/main.js"]
