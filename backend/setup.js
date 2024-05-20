const Sequelize = require('sequelize');
const Note = require('./src/models/notes'); // Asegúrate de que esta ruta sea correcta


const sequelize = new Sequelize('notas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });
  
  sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
    // Inicia el servidor Express aquí si lo deseas
  })
  .catch(error => {
    console.error('Error al sincronizar modelos:', error);
  });
