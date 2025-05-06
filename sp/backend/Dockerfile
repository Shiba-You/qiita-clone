FROM node:20

WORKDIR /app

ENV NODE_ENV ${NODE_ENV}

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
