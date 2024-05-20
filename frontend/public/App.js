import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Función para cargar las notas al cargar el componente
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/notes');
        // Verificar el formato de los datos recibidos
        if (Array.isArray(response.data)) {
          setNotes(response.data);
        } else {
          setError('Formato de datos incorrecto');
          console.error('Formato de datos incorrecto:', response.data);
        }
      } catch (error) {
        setError('Error al cargar las notas');
        console.error('Error al cargar las notas:', error);
      }
      setLoading(false);
    };

    fetchNotes(); // Llama a la función para cargar las notas
  }, []); // Ejecuta el efecto solo una vez al cargar el componente

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el título y el contenido no estén vacíos
    if (!title.trim() || !content.trim()) {
      setMessage('El título y el contenido son obligatorios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/notes', {
        title,
        content,
      });
      setMessage('Nota enviada correctamente');
      console.log('Respuesta del servidor: ', response.data);
      // Agregar la nueva nota al estado de las notas
      setNotes([...notes, response.data]);
      // Limpiar los campos de título y contenido
      setTitle('');
      setContent('');
    } catch (error) {
      setMessage('Error al enviar la nota');
      console.error('Error al enviar la nota: ', error);
    }
  };

  return (
    <div className="App">
      <h1>Enviar Nota</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={!title.trim() || !content.trim() || loading}>
          {loading ? 'Enviando...' : 'Enviar Nota'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>Notas Registradas</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
