FROM node:22-bookworm
LABEL authors="Beyshin"

WORKDIR /app

RUN apt-get update && apt-get install -y nodejs npm

COPY package.json .
RUN npm install
COPY . .

EXPOSE 5173

cmd ["npm", "run", "dev"]