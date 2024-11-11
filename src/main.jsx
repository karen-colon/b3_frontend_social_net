import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';  // Importar la raíz de la aplicación React

// Import de assets
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

// Importar el paquete de localización
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es.json';

// Registrar el idioma
TimeAgo.addDefaultLocale(es);

// Crear la raíz de React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

