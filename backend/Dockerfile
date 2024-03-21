FROM node

WORKDIR /backend

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "src/server.js"]