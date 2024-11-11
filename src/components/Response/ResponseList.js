import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Responses({ postId }) {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
            const fetchResponses = async() => {
                try {
                    const response = await axios.get(`http://localhost:3900/api/responses/${postId}`);
                    setResponses(response.data); // Asegúrate de que la respuesta contenga las respuestas correctas
                } catch (error) {
                    console.error('Error al obtener respuestas:', error);
                }
            };

            fetchResponses();
        },

        [postId]);

    return ( <
            div > {
                responses.map((response) => ( < div key = { response._id } >
                    <
                    p > < strong > { response.userId } < /strong>: {response.text}</p > < /div>)
                } < /div>);
            }

            export default Responses;