import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import avatar from "../../../assets/img/default.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";

export const Sidebar = () => {
  const { auth, counters, setCounters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [publicationId, setPublicationId] = useState(null);
  const navigate = useNavigate();

  // Oculta el mensaje de éxito o error después de 1 segundo
  useEffect(() => {
    if (stored === "stored") {
      const timer = setTimeout(() => {
        setStored("not_stored");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [stored]);

  const savePublication = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Prepara los datos del formulario
    const newPublication = { ...form, user: auth._id };

    try {
      // Guarda la publicación en la base de datos
      const request = await fetch(`${Global.url}publication/new-publication`, {
        method: "POST",
        body: JSON.stringify(newPublication),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();

      if (data.status === "success") {
        setStored("stored");

        // Incrementa el contador de publicaciones
        setCounters((prev) => ({
          ...prev,
          publicationsCount: prev.publicationsCount + 1,
        }));

        // Redirige a "Mis Publicaciones"
        navigate("/rsocial/mis-publicaciones", { state: { newPublication: true } });

        // Subir imagen asociada (si aplica)
        const fileInput = document.querySelector("#file");
        if (fileInput.files[0]) {
          const formData = new FormData();
          formData.append("file0", fileInput.files[0]);

          const uploadRequest = await fetch(
            `${Global.url}publication/upload-media/${data.publicationStored._id}`,
            {
              method: "POST",
              body: formData,
              headers: { Authorization: token },
            }
          );

          const uploadData = await uploadRequest.json();
          if (uploadData.status !== "success") {
            setStored("error");
          }
        }
      } else {
        setStored("error");
      }
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      setStored("error");
    }

    // Resetea el formulario
    document.querySelector("#publication-form").reset();
  };

  const handleReplyChange = (e) => setReplyText(e.target.value);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem("token");
    const replyData = { publicationId, text: replyText };

    try {
      const response = await fetch(`${Global.url}publication/reply`, {
        method: "POST",
        body: JSON.stringify(replyData),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();

      if (result.status === "success") {
        setIsReplying(false);
        setReplyText("");
      } else {
        console.error("Error al enviar la respuesta:", result);
      }
    } catch (error) {
      console.error("Error en la solicitud de respuesta:", error);
    }
  };

  const handleReplyClick = (id) => {
    setPublicationId(id);
    setIsReplying(true);
  };

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name}</h1>
      </header>

      <div className="aside__container">
        <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              <img
                src={auth.image !== "default.png" ? auth.image : avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            </div>
            <div className="general-info__container-names">
              <Link to={`/rsocial/perfil/${auth._id}`} className="container-names__name">
                {auth.name} {auth.last_name}
              </Link>
              <p className="container-names__nickname">{auth.nick}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            {["Siguiendo", "Seguidores", "Publicaciones"].map((title, idx) => (
              <div key={idx} className="stats__following">
                <Link to={`/rsocial/${title.toLowerCase()}/${auth._id}`} className="following__link">
                  <span className="following__title">{title}</span>
                  <span className="following__number">
                    {idx === 0
                      ? counters.followingCount
                      : idx === 1
                      ? counters.followedCount
                      : counters.publicationsCount}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="aside__container-form">
          {stored === "stored" && <strong className="alert alert-success">¡Publicada correctamente!</strong>}
          {stored === "error" && <strong className="alert alert-danger">¡No se pudo publicar!</strong>}

          <form id="publication-form" className="container-form__form-post" autoComplete="off" onSubmit={savePublication}>
            <div className="form-post__inputs">
              <label htmlFor="text" className="form-post__label">
                ¿Qué quieres compartir hoy?
              </label>
              <textarea id="text" name="text" className="form-post__textarea" onChange={changed} />
            </div>

            <div className="form-post__inputs">
              <label htmlFor="file" className="form-post__label">
                Sube imagen a publicación
              </label>
              <input type="file" id="file" name="file0" className="form-post__image" />
            </div>

            <input type="submit" value="Enviar" className="form-post__btn-submit" />
          </form>

          
              
            
          
        </div>
      </div>
    </aside>
  );
};
