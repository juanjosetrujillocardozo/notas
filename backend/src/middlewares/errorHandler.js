const errorHandler = (err, req, res, next) => {
    console.error(err); // Loguea el error en la consola para propósitos de debugging
    
    // Verifica el tipo de error
    if (err instanceof SyntaxError) {
      // Error de sintaxis JSON
      return res.status(400).json({ message: 'Error de sintaxis en JSON' });
    } else {
      // Otro tipo de error
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
  module.exports = errorHandler;
  