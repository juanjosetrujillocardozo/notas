const Categories = require('../models/categories');

console.log(Categories);


// Controlador para crear una nueva categoría
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }
        const newCategory = await Categories.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
};

// Controlador para obtener una categoría por su ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Categories.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la categoría por ID' });
    }
};

// Controlador para actualizar una categoría por su ID
exports.updateCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }
        const category = await Categories.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        await category.update({ name });
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la categoría por ID' });
    }
};

// Controlador para eliminar una categoría por su ID
exports.deleteCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Categories.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        await category.destroy();
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la categoría por ID' });
    }
};

// Controlador para obtener todas las categorías
exports.getAllCategories = async (req, res) => {
    try {
      const allCategories = await Categories.findAll(); // Asegúrate de usar 'Categories' aquí
      res.json(allCategories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener todas las categorías' });
    }
  };
  