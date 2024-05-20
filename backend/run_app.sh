#!/bin/bash

# Instala las dependencias de la aplicación
echo "Instalando dependencias..."
npm install

# Crea la base de datos y sincroniza el modelo
echo "Creando la base de datos y sincronizando el modelo..."
node setup.js

# Inicia el servidor Express
echo "Iniciando el servidor Express..."
node index.js
