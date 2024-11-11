// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3900/api', // Cambia la URL según la configuración de tu servidor
});

export default api;