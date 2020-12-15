FROM node:12-slim

WORKDIR /work

COPY package.json /work
RUN npm install

COPY . /work

EXPOSE 3000

CMD ["npm", "start"]