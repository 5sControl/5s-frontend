FROM node:latest
RUN apt-get update -y
RUN apt-get install nmap -y
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
