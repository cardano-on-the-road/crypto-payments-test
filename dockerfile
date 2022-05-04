FROM node:16.14.2

# Create app directory
WORKDIR /usr/src/app

COPY NODE-APP ./
COPY DATA ./

WORKDIR /usr/src/app/NODE-APP

RUN npm install

COPY ./NODE-APP .

WORKDIR /usr/src/app 

CMD [ "node", "server.js" ]