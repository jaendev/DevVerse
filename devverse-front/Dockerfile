# Dockerfile para el frontend de DevVerse (Next.js)

# Etapa de construcción
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]