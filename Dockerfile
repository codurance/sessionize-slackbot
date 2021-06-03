FROM node:alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:alpine AS production
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=build ./app/build .
ENTRYPOINT [ "node", "main.js"]
