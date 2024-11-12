// src/components/ReplyForm.js
import React, { useState } from 'react';

const ReplyForm = ({ postId, onReplySubmitted }) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        // Aquí debes llamar a la API para enviar la respuesta
        const response = await fetch(`http://localhost:3900/api/posts/${postId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: replyText }),
        });
        if (response.ok) {
            setReplyText('');
            onReplySubmitted();
        }
    };

    return ( < form onSubmit = { handleSubmit } >
        <
        textarea value = { replyText }
        onChange = {
            (e) => setReplyText(e.target.value)
        }
        placeholder = "Escribe una respuesta..." / >
        <
        button type = "submit" > Responder < /button> </form >
    );
};

export default ReplyForm;