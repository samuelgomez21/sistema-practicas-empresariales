# Etapa de construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json package-lock.json* ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Argumento para la URL de la API (por defecto localhost)
ARG VITE_API_URL=http://localhost:8082
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET

# Hacemos las variables disponibles para Vite en el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

# Compilamos la aplicación para producción
RUN npm run build

# Etapa de producción (Run)
FROM nginx:alpine

# Copiamos el build generado a la carpeta de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos una configuración personalizada para NGINX (SPA Routing)
# Si tu app tiene react-router, Nginx necesita redirigir todo a index.html
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos nginx
CMD ["nginx", "-g", "daemon off;"]
