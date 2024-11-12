import React, { useState } from "react";
import Swal from "sweetalert2"; // Si usas SweetAlert2 para mostrar mensajes emergentes

const YourComponent = () => {
    const [responseText, setResponseText] = useState(""); // Para el texto de la respuesta
    const [selectedPublication, setSelectedPublication] = useState(null); // Publicación seleccionada

    // Función para enviar la respuesta
    const handleResponseSubmit = async () => {
        // Verificamos que el texto no esté vacío
        if (!responseText.trim()) {
            Swal.fire('Error', 'No puedes enviar una respuesta vacía', 'warning');
            return;
        }

        // Comprobamos si hay publicación seleccionada
        if (!selectedPublication) {
            Swal.fire('Error', 'No se ha seleccionado ninguna publicación', 'warning');
            return;
        }

        const response = {
            publicationId: selectedPublication._id,
            responseText: responseText,
        };

        try {
            // Verificar si el token está disponible
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire('Error', 'No estás autenticado', 'error');
                return;
            }

            // Enviar la solicitud POST
            const request = await fetch(Global.url + "publication/response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token, // Se envía el token de autorización
                },
                body: JSON.stringify(response),
            });

            // Verificamos si la respuesta es válida
            const data = await request.json();

            console.log(data);  // Depuración: ver qué devuelve la API

            if (data.status === "success") {
                Swal.fire('Respuesta enviada', 'Tu respuesta ha sido enviada con éxito', 'success');
                setResponseText(""); // Limpiar el campo de respuesta
                setSelectedPublication(null); // Desmarcar la publicación seleccionada
            } else {
                Swal.fire('Error', 'Hubo un error al enviar la respuesta', 'error');
            }
        } catch (error) {
            console.error(error);  // Log para capturar cualquier error de la solicitud
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    return (
        <div>
            {/* Mostrar la publicación seleccionada */}
            {selectedPublication && (
                <div className="response-container">
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                    />
                    <button onClick={handleResponseSubmit}>Responder</button>
                </div>
            )}
        </div>
    );
};

export default YourComponent;
