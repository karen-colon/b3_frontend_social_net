import { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [selectedPublication, setSelectedPublication] = useState(null); // Publicación seleccionada para respuesta
    const [replyText, setReplyText] = useState(""); // Texto de la respuesta

    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPublications([]);
            setPage(1);
            nextPage = 1;
        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            let newPublications = data.publications;

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            setPublications(newPublications);

            if (!showNews && publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    }

    const handlePublicationSelect = (publicationId) => {
        // Si ya está seleccionada, deseleccionamos
        if (selectedPublication === publicationId) {
            setSelectedPublication(null);
            setReplyText(""); // Limpiamos el texto de la respuesta
        } else {
            setSelectedPublication(publicationId); // Seleccionamos la publicación para responder
        }
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyText) return; // No enviamos si no hay texto de respuesta

        const token = localStorage.getItem("token");

        // Enviamos la respuesta al servidor
        const response = await fetch(Global.url + "publication/reply", {
            method: "POST",
            body: JSON.stringify({
                publicationId: selectedPublication,
                replyText
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const result = await response.json();

        if (result.status === "success") {
            // Limpiamos el estado después de enviar la respuesta
            setSelectedPublication(null);
            setReplyText("");
            // Opcional: Puedes recargar las publicaciones para mostrar la nueva respuesta
            getPublications(page, false);
        } else {
            console.error("Error al enviar la respuesta");
        }
    };

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                isProfile={false} // No es un perfil, es el feed
                onSelectPublication={handlePublicationSelect} // Pasamos la función para seleccionar una publicación
            />

            {/* Formulario de respuesta */}
            {selectedPublication && (
                <div className="reply-form-container">
                    <textarea
                        value={replyText}
                        onChange={handleReplyChange}
                        placeholder="Escribe tu respuesta..."
                        className="reply-textarea"
                    />
                    <button onClick={handleReplySubmit} className="reply-submit-btn">
                        Responder
                    </button>
                </div>
            )}

            <br />
        </>
    );
};
