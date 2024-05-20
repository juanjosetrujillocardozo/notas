import React from 'react';
import { createRoot } from 'react-dom/client'; // Cambio en la importación
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')); // Cambio en la llamada a createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
