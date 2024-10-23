FROM node:latest
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]


COPY v2/mobile/package.json ./
RUN npm install
COPY . .
CMD ["npm", "dev"]

