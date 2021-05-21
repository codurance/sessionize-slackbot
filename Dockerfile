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
RUN npm install pm2 -g
EXPOSE 80
CMD ["pm2-runtime", "main.js"]