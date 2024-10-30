FROM node:18-bookworm

RUN apt-get -y update && \
    apt-get -y upgrade

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN npm install \
    && npm  run build

USER node
CMD node dist/main
