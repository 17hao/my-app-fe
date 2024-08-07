FROM node:16.20.2 AS node
WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY src src/
COPY .env .
COPY public public/
RUN npm run build
ENTRYPOINT ["npm", "start"]
