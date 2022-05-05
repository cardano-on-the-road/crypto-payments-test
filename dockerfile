FROM node:16.14.2

# Create app directory
WORKDIR /usr/src/app

COPY NODE-APP ./NODE-APP
COPY DATA ./DATA

WORKDIR /usr/src/app/NODE-APP

RUN npm install

CMD [ "node", "main.js" ]