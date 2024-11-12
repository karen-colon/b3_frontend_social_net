import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import avatar from "../../../assets/img/default.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {
  const { auth, counters, setCounters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [isReplying, setIsReplying] = useState(false); // State for managing reply form visibility
  const [replyText, setReplyText] = useState(""); // State for managing the reply text
  const navigate = useNavigate();

  // useEffect to hide the success message after 1 second
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

    // Collect form data
    let newPublication = form;
    newPublication.user = auth._id;

    // Request to save the publication
    const request = await fetch(Global.url + "publication/new-publication", {
        method: "POST",
        body: JSON.stringify(newPublication),
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });

    const data = await request.json();

    // Show success or error message
    if (data.status === "success") {
        setStored("stored");
        setCounters((prevCounters) => ({
          ...prevCounters,
          publicationsCount: prevCounters.publicationsCount + 1, // Increment by 1
        }));
        navigate("/rsocial/mis-publicaciones", { state: { newPublication: true } });
    } else {
        setStored("error");
    }

    // Upload image
    const fileInput = document.querySelector("#file");

    if (data.status === "success" && fileInput.files[0]) {
        const formData = new FormData();
        formData.append("file0", fileInput.files[0]);

        const uploadRequest = await fetch(Global.url + "publication/upload-media/" + data.publicationStored._id, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": token
            }
        });

        const uploadData = await uploadRequest.json();

        if (uploadData.status !== "success") {
            setStored("error");
        }
    }

    // Reset the form
    const myForm = document.querySelector("#publication-form");
    myForm.reset();
  };

  // Handle reply toggle
  const handleReplyToggle = () => {
    setIsReplying(!isReplying);
  };

  // Handle reply input change
  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const replyData = {
      text: replyText,
      user: auth._id,
    };

    // Request to save the reply (you may need to associate the reply with the publication)
    const response = await fetch(Global.url + "publication/reply", {
      method: "POST",
      body: JSON.stringify(replyData),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      setIsReplying(false);
      setReplyText(""); // Clear the reply form
    } else {
      console.error("Reply submission failed");
    }
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
              {auth.image !== "default.png" ? (
                <img src={auth.image} className="container-avatar__img" alt="Foto de perfil" />
              ) : (
                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
              )}
            </div>
            <div className="general-info__container-names">
              <Link to={"/rsocial/perfil/" + auth._id} className="container-names__name">
                {auth.name} {auth.last_name}
              </Link>
              <p className="container-names__nickname">{auth.nick}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <Link to={"/rsocial/siguiendo/" + auth._id} className="following__link">
                <span className="following__title">Siguiendo</span>
                <span className="following__number">{counters.followingCount}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={"/rsocial/seguidores/" + auth._id} className="following__link">
                <span className="following__title">Seguidores</span>
                <span className="following__number">{counters.followedCount}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={"/rsocial/mis-publicaciones/"} className="following__link">
                <span className="following__title">Publicaciones</span>
                <span className="following__number">{counters.publicationsCount}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="aside__container-form">
          {stored === "stored" && <strong className="alert alert-success">¡¡Publicada correctamente!!</strong>}
          {stored === "error" && <strong className="alert alert-danger">¡¡No se ha publicado nada!!</strong>}

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

        {/* Reply Button and Form */}
        <div className="aside__container-reply">
          <button onClick={handleReplyToggle} className="btn-reply">
            Responder
          </button>

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="reply-form">
              <textarea
                className="form-reply__textarea"
                value={replyText}
                onChange={handleReplyChange}
                placeholder="Escribe tu respuesta..."
              />
              <button type="submit" className="form-reply__btn-submit">
                Enviar respuesta
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
};
