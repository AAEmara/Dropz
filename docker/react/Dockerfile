FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

CMD ["npm", "run", "dev"]
