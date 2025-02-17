FROM node:22-bookworm

RUN apt-get -y update && \
    apt-get -y upgrade

WORKDIR /usr/src/app
ADD editor-api /usr/src/app/editor-api
ADD shared /usr/src/app/shared

WORKDIR /usr/src/app/editor-api
RUN npm install \
    && npm  run build

USER node
CMD node dist/editor-api/src/main
