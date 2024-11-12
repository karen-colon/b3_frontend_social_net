import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Respuesta from './Respuesta';  // Importa el componente de Respuesta

const Publicacion = ({ publicacionId }) => {
  const [publicacion, setPublicacion] = useState(null);

  // Cargar la publicación desde el backend (usamos el publicacionId para buscarla)
  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const res = await axios.get(`http://localhost:3900/api/publicaciones/${publicacionId}`);
        setPublicacion(res.data);
      } catch (error) {
        console.error('Error al cargar la publicación:', error);
      }
    };

    fetchPublicacion();
  }, [publicacionId]);

  if (!publicacion) return <p>Cargando publicación...</p>;

  return (
    <div className="publicacion">
      <h2>{publicacion.titulo}</h2>
      <p>{publicacion.contenido}</p>

      {/* Mostrar las respuestas */}
      <div>
        <h3>Respuestas:</h3>
        {publicacion.respuestas && publicacion.respuestas.length > 0 ? (
          publicacion.respuestas.map((respuesta) => (
            <div key={respuesta._id} className="respuesta">
              <p>{respuesta.texto}</p>
            </div>
          ))
        ) : (
          <p>No hay respuestas aún.</p>
        )}
      </div>

      {/* Mostrar el formulario para agregar una respuesta */}
      <Respuesta publicacionId={publicacionId} />
    </div>
  );
};

export default Publicacion;
