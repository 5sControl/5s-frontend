FROM node:20.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ARG BASE_URL
# ENV BASE_URL=${BASE_URL}

# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:latest AS production
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

COPY replace-env.sh /usr/local/bin/replace-env.sh
RUN chmod +x /usr/local/bin/replace-env.sh

ENTRYPOINT ["/usr/local/bin/replace-env.sh"]