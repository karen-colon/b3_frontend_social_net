import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import avatar from "../../assets/img/default.png";

export const PublicationDetail = () => {
  const { id } = useParams(); // Obtener el ID de la publicación desde la URL
  const location = useLocation(); // Saber si venimos del Feed o de MyPublications
  const [publication, setPublication] = useState(null);
  const [responses, setResponses] = useState([]); // Estado para las respuestas
  const [newResponseText, setNewResponseText] = useState(''); // Estado para el texto de la nueva respuesta

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

      if (!request.ok) {
        throw new Error('Error al cargar la publicación');
      }

      const data = await request.json();

      // Verificar que la respuesta contenga la publicación y el usuario
      if (data.status === 'success' && data.publication && data.publication.user_id) {
        setPublication(data.publication);
        setResponses(data.publication.responses || []); // Establecer las respuestas si existen
      } else {
        console.error("Error: publicación o usuario no encontrados.");
      }

    } catch (error) {
      console.error('Error en la solicitud de la publicación:', error);
    }
  };

  const submitResponse = async () => {
    if (!newResponseText.trim()) return; // Verificar si el texto no está vacío

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Global.url}publication/add-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          publicacionId: id,
          text: newResponseText
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setResponses([...responses, data.response]); // Agregar la nueva respuesta a la lista
        setNewResponseText(''); // Limpiar el campo de texto
      } else {
        console.error('Error al agregar la respuesta:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud de agregar respuesta:', error);
    }
  };

  if (!publication) {
    return <p>Cargando...</p>; // Mostrar mientras se carga la publicación
  }

  // Verificar que los datos del usuario estén disponibles
  const user = publication.user_id || {}; // Si `user_id` no está definido, asigna un objeto vacío
  const userImage = user.image && user.image !== "default.png" ? user.image : avatar; // Imagen predeterminada si no hay imagen
  const userName = `${user.name || "Usuario"} ${user.last_name || ""}`; // Nombre predeterminado si no hay datos
  const userNick = user.nick || "usuario"; // Nick predeterminado si no hay datos

  return (
    <div className="publication-detail-container">
      <div className="publication-detail-header">
        {/* Verificar y mostrar el avatar del usuario */}
        <img src={userImage} alt="Perfil" className="profile-image" />
        <div className="publication-detail-user-info">
          <h2>{userName}</h2>
          <p className="user-nick">{userNick}</p>
        </div>
      </div>

      <div className="publication-detail-content">
        <div className="publication-text">
          <p>{publication.text}</p>
        </div>
        {publication.file && (
          <img src={publication.file} alt="Publicación" className="publication-image" />
        )}
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

      {/* Sección de respuestas */}
      <div className="responses">
        <h3>Respuestas</h3>
        {responses.length > 0 ? (
          responses.map((response) => (
            <div key={response._id} className="response-item">
              <p>{response.text}</p>
              <p>{response.user?.name || 'Usuario'}</p>
            </div>
          ))
        ) : (
          <p>No hay respuestas aún.</p>
        )}
      </div>

      {/* Formulario para agregar una respuesta */}
      <div className="response-form">
        <textarea
          value={newResponseText}
          onChange={(e) => setNewResponseText(e.target.value)}
          placeholder="Escribe tu respuesta..."
        />
        <button onClick={submitResponse}>Responder</button>
      </div>
    </div>
  );
};
