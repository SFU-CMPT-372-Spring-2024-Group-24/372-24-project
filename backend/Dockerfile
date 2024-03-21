FROM node

WORKDIR /backend

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]