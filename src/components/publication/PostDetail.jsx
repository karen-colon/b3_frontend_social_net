import { useState } from 'react';

function PostDetail({ publicacion }) {
    const [respuesta, setRespuesta] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/publicaciones/${publicacion.id}/responder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ texto: respuesta, usuario: 'karen' }),
        });
        const data = await res.json();
        if (data.message === 'Respuesta guardada exitosamente') {
            alert('Respuesta enviada');
            setRespuesta('');
        }
    };

    return (
        <div>
            <h2>{publicacion.titulo}</h2>
            <p>{publicacion.contenido}</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                />
                <button type="submit">Responder</button>
            </form>
            <div>
                <h3>Respuestas:</h3>
                {publicacion.respuestas.map((resp, index) => (
                    <p key={index}>{resp.usuario}: {resp.texto}</p>
                ))}
            </div>
        </div>
    );
}
