FROM node:22-slim AS base-linux
WORKDIR /app
COPY ./ ./
RUN npm i
RUN npm install -g npm@latest
CMD npm run dev