FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 8082
CMD ["npm", "start"]
