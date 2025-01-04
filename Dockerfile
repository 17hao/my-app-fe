FROM node:16.20.2 AS node
WORKDIR /app
COPY package.json .
COPY .npmrc .
RUN npm install --verbose
COPY public public/
COPY src src/
COPY jsconfig.json .
COPY .env.production .
RUN npm run build

FROM nginx:stable
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/build /usr/share/nginx/html
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log
