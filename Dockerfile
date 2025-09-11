FROM node:22-bookworm

RUN apt-get -y update && \
    apt-get -y upgrade

WORKDIR /usr/src/
ADD api /usr/src/api

WORKDIR /usr/src/api
RUN npm ci \
    && npm run build

USER node
CMD node dist/main
