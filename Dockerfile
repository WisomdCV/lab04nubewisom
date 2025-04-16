# Usa una versión específica de Node (no 'latest' para evitar sorpresas)
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# 1. Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias (limpia caché para reducir tamaño)
RUN npm install --production && npm cache clean --force

# 2. Copia el resto de archivos (excluyendo node_modules con .dockerignore)
COPY . .

# Puerto expuesto (documentación, no abre el puerto automáticamente)
EXPOSE 9000

# Comando de arranque
CMD ["node", "app.js"]