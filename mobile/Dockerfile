FROM node:20.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:latest
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENTRYPOINT ["/entrypoint.sh"]