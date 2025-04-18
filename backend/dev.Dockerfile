FROM node:16.20.2

WORKDIR /usr/src/app

COPY --chown=node:node . .

COPY . .

RUN npm install --legacy-peer-deps

ENV DEBUG=express:*

USER node

CMD ["npm", "run", "docker-dev"]