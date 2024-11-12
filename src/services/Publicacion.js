import React, { useEffect, useState } from 'react';
import Respuesta from './Respuesta';
import axios from 'axios';

const Publicacion = ({ publicacionId }) => {
    const [publicacion, setPublicacion] = useState(null);

    useEffect(() => {
        // Obtener la publicación del backend
        const fetchPublicacion = async() => {
            try {
                const response = await axios.get(`http://localhost:3900/api/publicaciones/${publicacionId}`);
                setPublicacion(response.data);
            } catch (error) {
                console.error('Error al obtener la publicación', error);
            }
        };

        fetchPublicacion();
    }, [publicacionId]);

    if (!publicacion) {
        return <div > Cargando publicación... < /div>;
    }

    return ( <
        div className = "publicacion" >
        <
        h2 > { publicacion.titulo } < /h2> <
        p > { publicacion.contenido } < /p>

        { /* Aquí se renderizan las respuestas */ } <
        div >
        <
        h3 > Respuestas: < /h3> {
            publicacion.respuestas.map((respuesta) => ( <
                div key = { respuesta._id }
                className = "respuesta" >
                <
                p > { respuesta.texto } < /p> <
                /div>
            ))
        } <
        /div>

        { /* Aquí se agrega el componente de respuesta */ } <
        Respuesta publicacionId = { publicacionId }
        /> <
        /div>
    );
};

export default Publicacion;