# Stage 1: Build the React application
FROM node:20 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Копируем конфигурацию Nginx в контейнер
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы во фронтенд
COPY --from=build /app/build /usr/share/nginx/html

# Порт, на котором будет работать Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
