// Importa Express
const express = require('express');

// Importa el middleware body-parser
const bodyParser = require('body-parser');

// Importa Sequelize y la instancia de la base de datos
const sequelize = require('./src/sequelize');

// Importa el modelo de notas
const Note = require('./src/models/notes');

// Importa el modelo de usuario
const User = require('./src/models/user');

// Importa el modelo de categorías
const Category = require('./src/models/categories');

// Importa bcrypt para el hash de contraseñas
const bcrypt = require('bcrypt');

// Importa jsonwebtoken para la generación de tokens JWT
const jwt = require('jsonwebtoken');

// Importa Morgan para el logging de solicitudes HTTP
const morgan = require('morgan');

// Importa el middleware de manejo de errores global
const errorHandler = require('./src/middlewares/errorHandler');

const categoriesController = require('./src/controllers/categoriesController');


// Importa el paquete cors
const cors = require('cors');

// Sincroniza los modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch(error => {
    console.error('Error al sincronizar modelos:', error);
  });

// Crea una instancia de la aplicación Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Middleware de logging de solicitudes
app.use(morgan('dev'));

// Middleware de manejo de errores global
app.use(errorHandler);

// Middleware de análisis de cuerpo (body-parser) para analizar datos JSON
app.use(bodyParser.json());

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Hash de la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario en la base de datos
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token de acceso
    const token = jwt.sign({ username: user.username }, 'secreto', { expiresIn: '1h' });

    // Enviar el token como respuesta
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta protegida que requiere autenticación
app.get('/ruta-protegida', authenticateToken, (req, res) => {
  // Acceso concedido, puedes devolver los datos al cliente
  res.json({ message: 'Acceso concedido' });
});

// Función middleware para autenticar el token de acceso
function authenticateToken(req, res, next) {
  // Obtener el token de autorización del encabezado de la solicitud
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Si no hay token, enviar estado no autorizado

  // Verificar y decodificar el token
  jwt.verify(token, 'secreto', (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no es válido, enviar estado prohibido
    req.user = user;
    next(); // Pasar al siguiente middleware
  });
}

// Ruta para obtener todas las notas activas
app.get('/notes/active', async (req, res) => {
  try {
    const activeNotes = await Note.findAll({ where: { archived: false } });
    res.json(activeNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las notas Activas' });
  }
});

// Ruta para obtener todas las notas archivadas
app.get('/notes/archived', async (req, res) => {
  try {
    const archivedNotes = await Note.findAll({ where: { archived: true } });
    res.json(archivedNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las notas archivadas' });
  }
});

// Ruta para obtener todas las categorías
app.get('/categories/all', categoriesController.getAllCategories);


// Ruta para filtrar las notas por categoría
app.get('/notes/category/:category', async (req, res) => {
  const category = req.params.category;
  try {
    // Buscar todas las notas que contienen la categoría especificada
    const notes = await Note.findAll({
      where: {
        categories: {
          [sequelize.Op.contains]: [category]
        }
      }
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al filtrar las notas por categoría' });
  }
});

// Ruta para obtener todas las notas
app.get('/notes/all', async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
});

// Ruta para obtener una nota por su ID
app.get('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findByPk(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Nota buscada no encontrada' });
    }
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la nota por ID' });
  }
});

// Ruta para crear una nueva nota
app.post('/notes', async (req, res) => {
  try {
    // Verificar si la solicitud contiene datos en req.body
    if (!req.body) {
      return res.status(400).json({ message: 'La solicitud no contiene datos.' });
    }

    // Verificar si la solicitud contiene el campo 'title'
    if (!req.body.title) {
      return res.status(400).json({ message: 'El campo "title" es requerido.' });
    }

    // Crear una nueva nota utilizando los datos proporcionados en el cuerpo de la solicitud
    const newNote = await Note.create(req.body);

    // Devolver la nueva nota creada como respuesta
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);

    // Verificar si el error es de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      // Devolver mensajes de error específicos para cada campo
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      res.status(400).json({ errors });
    } else {
      // Devolver un mensaje de error genérico para otros tipos de errores
      res.status(500).json({ message: 'Error al crear una nueva nota' });
    }
  }
});

// Ruta para actualizar una nota por su ID
app.put('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota para actualizar no encontrada' });
    }

    // Actualizar la nota con los datos proporcionados en el cuerpo de la solicitud
    await note.update(req.body);

    // Devolver la nota actualizada como respuesta
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la nota' });
  }
});

// Ruta para eliminar una nota por su ID
app.delete('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota para eliminar no encontrada' });
    }

    // Eliminar la nota de la base de datos
    await note.destroy();

    // Devolver un mensaje de éxito como respuesta
    res.json({ message: 'Nota eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la nota' });
  }
});

// Ruta para agregar una categoría a una nota
app.post('/notes/:id/category', async (req, res) => {
  const noteId = req.params.id;
  const { category } = req.body;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota para agregarle la categoria no encontrada' });
    }

    // Agregar la categoría a la nota
    note.categories.push(category);

    // Guardar la nota actualizada en la base de datos
    await note.save();

    // Devolver la nota actualizada como respuesta
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar la categoría a la nota' });
  }
});

// Ruta para eliminar una categoría de una nota
app.delete('/notes/:id/category', async (req, res) => {
  const noteId = req.params.id;
  const { category } = req.body;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada para eliminar su categoria' });
    }

    // Eliminar la categoría de la nota
    note.categories = note.categories.filter(cat => cat !== category);

    // Guardar la nota actualizada en la base de datos
    await note.save();

    // Devolver la nota actualizada como respuesta
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la categoría de la nota' });
  }
});

// Ruta para archivar una nota por su ID
app.put('/notes/:id/archive', async (req, res) => {
  const noteId = req.params.id;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada para archivar' });
    }

    // Archivar la nota
    note.archived = true;

    // Guardar la nota actualizada en la base de datos
    await note.save();

    // Devolver la nota actualizada como respuesta
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al archivar la nota' });
  }
});

// Ruta para desarchivar una nota por su ID
app.put('/notes/:id/unarchive', async (req, res) => {
  const noteId = req.params.id;
  try {
    // Buscar la nota por su ID
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada para desarchivar' });
    }

    // Desarchivar la nota
    note.archived = false;

    // Guardar la nota actualizada en la base de datos
    await note.save();

    // Devolver la nota actualizada como respuesta
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desarchivar la nota' });
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
