FROM node:20

WORKDIR /server
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5001
CMD [ "node", "app.js" ]
