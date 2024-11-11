import React, { useState } from 'react';
import axios from 'axios';

const ReplyForm = ({ postId, onReplySubmitted }) => {
    const [replyText, setReplyText] = useState('');

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const submitReply = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3900/api/replies`, {
                postId,
                content: replyText,
            });
            if (response.status === 201) {
                setReplyText('');
                onReplySubmitted(response.data); // Actualiza el estado de respuestas en la publicación
            }
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
        }

    };
    return ( < form onSubmit = { submitReply } >
        <
        textarea value = { replyText }
        onChange = { handleReplyChange }
        placeholder = "Escribe tu respuesta aquí"
        rows = "3" / >
        <
        button type = "submit" > Responder < /button> </form >
    );
};

export default ReplyForm;