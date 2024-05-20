import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NoteEdit({ match }) {
  const [note, setNote] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Aquí puedes realizar una solicitud GET al backend para obtener la nota específica
    // Ejemplo usando axios:
    axios.get(`/notes/${match.params.id}`)
      .then(response => {
        setNote(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch(error => {
        console.error('Error al obtener la nota:', error);
      });
  }, [match.params.id]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar la solicitud de actualización al backend
  };

  return (
    <div>
      <h2>Editar Nota</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
        <br />
        <label>
          Contenido:
          <textarea value={content} onChange={handleContentChange} />
        </label>
        <br />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default NoteEdit;
