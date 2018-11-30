FROM node:10.14-alpine

ENV HOME=/home/app

COPY package.json yarn.lock $HOME/api/

WORKDIR $HOME/api

RUN yarn

COPY ./ $HOME/

CMD ["yarn", "start"]
