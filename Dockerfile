FROM node:12-slim

WORKDIR /work

COPY package.json /work
RUN npm install

COPY . /work

ENTRYPOINT ["npm", "start"]