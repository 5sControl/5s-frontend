FROM node:latest
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "start"]


COPY v2/mobile/package.json ./
RUN npm install --legacy-peer-deps
COPY v2/mobile ./
CMD ["npm", "dev"]

