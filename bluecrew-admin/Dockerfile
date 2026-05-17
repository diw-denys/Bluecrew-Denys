# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build -- --configuration production --base-href /admin/

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist/bluecrew-admin/browser /usr/share/nginx/html/admin

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
