FROM node:16.20.2

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run tsc

USER node

ENV NODE_ENV=production

CMD ["node", "build/index.js"]
