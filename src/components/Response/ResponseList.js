import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResponseList({ postId }) {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchResponses = async() => {
            try {
                const result = await axios.get(`http://localhost:3900/api/responses?postId=${postId}`);
                setResponses(result.data); // Asignar las respuestas a la lista
            } catch (error) {
                console.error('Error al obtener las respuestas:', error);
            }
        };
        fetchResponses();
    }, [postId]);

    return ( <
        div >
        <
        h3 > Respuestas: < /h3> {
            responses.map(response => ( <
                div key = { response._id } >
                <
                p > { response.text } < /p> <
                small > { response.userId } < /small> <
                /div>
            ))
        } <
        /div>
    );
}

export default ResponseList;