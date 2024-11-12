import React, { useState } from 'react';
import axios from 'axios';

const Respuesta = ({ publicacionId }) => {
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar el cambio de texto en el campo de respuesta
  const handleRespuestaChange = (e) => {
    setRespuesta(e.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3900/api/respuestas', {
        publicacionId,
        respuesta,
      });

      if (res.status === 200) {
        // Limpiar el campo de respuesta
        setRespuesta('');
        alert('Respuesta enviada con éxito');
      }
    } catch (error) {
      console.error('Error al enviar la respuesta', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={respuesta}
          onChange={handleRespuestaChange}
          placeholder="Escribe tu respuesta..."
          rows="4"
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Respuesta'}
        </button>
      </form>
    </div>
  );
};

export default Respuesta;
