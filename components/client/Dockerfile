FROM node:15.1.0
#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY client.js .
COPY files/test.json ./files/

CMD [ "node", "client.js", "test.json", "0", "http://apiserver:3001" ]