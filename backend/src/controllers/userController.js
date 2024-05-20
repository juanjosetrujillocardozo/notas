// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register(req, res) {
    try {
        const { email, password } = req.body;
        // Hash de la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear un nuevo usuario en la base de datos
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        // Buscar el usuario por su email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Generar un token de acceso JWT
        const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
}

module.exports = { register, login };
