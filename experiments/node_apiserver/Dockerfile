FROM node:15.1.0
#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm i nodemon -g

COPY . .

CMD [ "node", "server.js" ]