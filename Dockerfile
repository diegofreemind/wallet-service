FROM node:8.9-alpine

WORKDIR /api
COPY . .

RUN yarn
ENV MONGO_HOST 'mongodb://mongo:27017/wallet-strategy'

EXPOSE 8080
CMD [ "npm", "start" ]