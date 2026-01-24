FROM node:24.13.0 AS node
WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY public public/
COPY src src/
COPY .env.production .
COPY index.html .
COPY tsconfig.json .
COPY vite.config.js .
RUN npm run build

FROM nginx:stable
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist /usr/share/nginx/html
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log
