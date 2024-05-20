const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Category = require('./categories');

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
});

// Define la relación muchos a muchos con la tabla Category
Note.belongsToMany(Category, { through: 'note_categories' });


module.exports = Note;
