import React from 'react';

const NoteList = ({ notes }) => {
  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.title}
            {/* Agrega botones para editar y eliminar notas si es necesario */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
