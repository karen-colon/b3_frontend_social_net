import React, { useState } from 'react';
import axios from 'axios';

function ResponseForm({ postId, userId }) {
    const [responseText, setResponseText] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3900/api/responses', {
                postId,
                userId,
                text: responseText
            });
            console.log(response.data); // Maneja la respuesta del servidor
            setResponseText(''); // Limpiar el campo de texto
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
        }
    };

    return ( < form onSubmit = { handleSubmit } >
        <
        textarea value = { responseText }
        onChange = {
            (e) => setResponseText(e.target.value)
        }
        placeholder = "Escribe tu respuesta..."
        required / >
        <
        button type = "submit" > Responder < /button> </form >
    );
}

export default ResponseForm;