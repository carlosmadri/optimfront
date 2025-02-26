FROM node:20-alpine AS build
RUN npm cache clean --force
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/optim-ui/browser /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
