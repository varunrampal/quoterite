#Dockerfile
# PROD CONFIG
FROM node as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

WORKDIR /app/server

COPY ./server/package*.json ./

RUN npm install

EXPOSE 5000

WORKDIR /app

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]