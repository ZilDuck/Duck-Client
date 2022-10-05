FROM node:16.13.1 as build

WORKDIR /app

COPY . .

RUN npm i 

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "npm", "start" ]
