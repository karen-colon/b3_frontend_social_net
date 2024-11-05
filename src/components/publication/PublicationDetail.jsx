import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Global } from '../../helpers/Global';

export const PublicationDetail = () => {

  const { id } = useParams(); // Obtener el ID de la publicación desde la URL
  const location = useLocation(); // Saber si venimos del Feed o de MyPublications
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    getPublication();
  }, []);

  // Función para obtener la publicación desde la API
  const getPublication = async () => {

    try {

      const token = localStorage.getItem('token');

      const request = await fetch(`${Global.url}publication/show-publication/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      // Verifica si la respuesta no es un JSON válido
      if (!request.ok) {
        throw new Error('Error al cargar la publicación');
      }

      const data = await request.json();

      if (data.status === 'success') {
        setPublication(data.publication);
      } else {
        console.error("Error: publicación no encontrada.");
      }

    } catch (error) {
      console.error('Error en la solicitud de la publicación:', error);
    }
  };

  if (!publication) {
    return <p>Cargando...</p>; // Mostrar mientras se carga la publicación
  }

  return (
    <div className="publication-detail-container">
      <div className="publication-detail-header">
        <img src={publication.user_id.image} alt="Perfil" className="profile-image" />
        <div className="publication-detail-user-info">
          <h2>{publication.user_id.name} {publication.user_id.last_name}</h2>
          <p className="user-nick">@{publication.user_id.nick}</p>
        </div>
      </div>

      <div className="publication-detail-content">
        <div className="publication-text">
          <p>{publication.text}</p>
        </div>
        <img src={publication.file} alt="Publicación" className="publication-image" />
      </div>

      <div className="publication-detail-button">
        {location.state?.from === 'feed' ? (
          <Link to="/rsocial/feed">
            <button className="btn-back">Volver al Feed</button>
          </Link>
        ) : (
          <Link to="/rsocial/mis-publicaciones">
            <button className="btn-back">Volver a Mis Publicaciones</button>
          </Link>
        )}
      </div>
    </div>
  );
};
