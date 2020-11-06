FROM node:slim

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

RUN npm run db:sync

CMD ["npm", "start"]

