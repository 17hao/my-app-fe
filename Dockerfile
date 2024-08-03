FROM node:16.20.2 AS node
WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY src src/
COPY public public/
RUN npm run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/build /usr/share/nginx/html
