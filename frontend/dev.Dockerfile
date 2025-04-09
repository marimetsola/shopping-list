FROM node:16.20.2

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "docker-start"]