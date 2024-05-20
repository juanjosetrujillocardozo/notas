const Sequelize = require('sequelize');

const sequelize = new Sequelize('notas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
