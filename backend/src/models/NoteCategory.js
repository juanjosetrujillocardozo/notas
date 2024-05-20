// models/noteCategory.js
const Sequelize = require('sequelize');
const sequelize = require('../../sequelize');
const Category = require('./categories'); // Corregir el nombre de la tabla

const NoteCategory = sequelize.define('noteCategory', {
  noteId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false, // Asegurar que siempre haya una categoría asociada
  },
  associationDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // Establecer el valor predeterminado como la fecha actual
  },
}, {});


NoteCategory.belongsTo(Note, { foreignKey: 'noteId' });
// Establecer las relaciones con las tablas notes y categories
NoteCategory.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = NoteCategory;
