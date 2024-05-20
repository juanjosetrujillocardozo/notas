#!/bin/bash

# Dar permisos de ejecución al script
chmod +x "$0"

# Actualiza el índice de paquetes
sudo apt update

# Instala MySQL Server
sudo apt install mariadb-server

# Inicia el servicio de MySQL
sudo systemctl start mysql

# Verifica el estado del servicio de MySQL
sudo systemctl status mysql

# Inicia sesión en MySQL
echo "Iniciando sesión en MySQL. (Ingrese la contraseña de root si es necesario)"
mysql -u root -p

# Crear una nueva base de datos (si es necesario)
echo "Creando la base de datos 'notas'."
echo "CREATE DATABASE IF NOT EXISTS notas;" > create_database.sql
echo "USE notas;" >> create_database.sql

# Obtén la ruta actual
current_dir=$(pwd)

# Guarda la ruta del archivo SQL en una variable
sql_file="$current_dir/notas.sql"

# Verifica si el archivo SQL existe
if [ -f "$sql_file" ]; then
  # Importa el archivo SQL
  echo "Importando el archivo $sql_file a la base de datos 'notas'."
  echo "SOURCE $sql_file;" >> create_database.sql
  mysql -u root -p < create_database.sql
else
  echo "ERROR: El archivo $sql_file no existe."
fi

# Elimina el archivo temporal create_database.sql
rm create_database.sql

# Salir de MySQL
exit

# Iniciar el backend
echo "Iniciando el backend..."
cd backend
npm install # Instalar dependencias del backend
node index.js &
echo "Servidor backend iniciado."

# Esperar unos segundos para que el servidor backend se inicie correctamente
sleep 10

# Iniciar el frontend
echo "Iniciando el frontend..."
cd ../frontend
npm install # Instalar dependencias del frontend
npm start & # Iniciar servidor de desarrollo del frontend en segundo plano
echo "Servidor frontend iniciado."

# Abrir el navegador (opcional)
if [ "$(uname)" == "Darwin" ]; then
  open http://localhost:3000  # macOS
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  xdg-open http://localhost:3000  # Linux
fi

# Esperar unos segundos para que el servidor frontend se inicie correctamente
sleep 10

echo "¡Listo! La aplicación está en funcionamiento en http://localhost:3000."
