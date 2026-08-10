# Usamos Node 22, requerido por express-handlebars (>=22.15.0)
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero package.json para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos dependencias (solo producción)
RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

# Puerto que expone la app
EXPOSE 8080

# Comando de arranque
CMD ["node", "src/app.js"]