FROM node:20

WORKDIR /server
COPY  package*.json ./
RUN npm install

COPY . .
EXPOSE 4500
CMD [ "node", "server.js" ]