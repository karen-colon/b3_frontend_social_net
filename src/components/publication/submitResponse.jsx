const submitResponse = async () => {
    if (!newResponseText.trim()) return; // Verificar si el texto no está vacío

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${Global.url}publication/add-response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token // Incluir el token de autenticación
            },
            body: JSON.stringify({
                publicacionId: id, // ID de la publicación actual
                text: newResponseText // Texto de la respuesta
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
