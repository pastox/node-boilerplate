FROM node:12.16.3-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 6710

CMD ["npm", "run", "start"]