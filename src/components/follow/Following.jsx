import { Global } from "../../helpers/Global";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { UserList } from "../user/UserList";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export const Following = () => {
  const token = localStorage.getItem("token");
  const { auth, setCounters } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Estado para la publicación seleccionada
  const [responseText, setResponseText] = useState(""); // Estado para el texto de la respuesta
  const params = useParams();

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPaginate = 1) => {
    try {
      const userId = params.userId;
      const response = await fetch(
        Global.url + "follow/following/" + userId + "/" + nextPaginate,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      let cleanUsers = [];
      data.follows.forEach((follow) => {
        cleanUsers = [...cleanUsers, follow.followed_user];
      });
      data.users = cleanUsers;

      if (data.users && data.status === "success") {
        let newUsers = data.users;

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }
        setUsers(newUsers);
        setFollowing(data.users_following);

        if (users.length >= data.total - 5) {
          setMore(false);
        }
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  };

  // Función para manejar la selección de la publicación a responder
  const handlePostSelect = (postId) => {
    if (selectedPost === postId) {
      setSelectedPost(null); // Desmarcar si la misma publicación es seleccionada
    } else {
      setSelectedPost(postId);
    }
  };

  // Función para manejar el cambio en el texto de la respuesta
  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  // Función para manejar el envío de la respuesta
  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (responseText.trim() === "") return;

    try {
      const response = await fetch(Global.url + "publication/reply", {
        method: "POST",
        body: JSON.stringify({
          publicationId: selectedPost,
          replyText: responseText,
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        // Limpiar el formulario de respuesta
        setResponseText("");
        setSelectedPost(null); // Cerrar el formulario de respuesta
        // Aquí puedes agregar alguna lógica para actualizar las respuestas de la publicación si es necesario
      } else {
        console.error("Error al enviar la respuesta");
      }
    } catch (error) {
      console.error("Error en la petición al backend:", error);
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">
          Usuarios que sigue {auth.name} {auth.last_name}
        </h1>
      </header>

      {users.length === 0 ? (
        <div className="no-following-message">
          <h3>
            Aún no sigues a ningún usuario en la red social, puedes hacer clic
            en
            <strong>
              <Link to="/rsocial/gente" className="highlight-gente">
                {" "}
                Gente{" "}
              </Link>
            </strong>
            para ver el listado de usuarios y seguir a quienes te interese.
          </h3>
        </div>
      ) : (
        <UserList
          users={users}
          getUsers={getUsers}
          following={following}
          setFollowing={setFollowing}
          more={more}
          page={page}
          setPage={setPage}
          setCounters={setCounters}
        />
      )}

      {/* Si hay una publicación seleccionada, mostrar el formulario de respuesta */}
      {selectedPost && (
        <div className="response-form">
          <h3>Responder publicación</h3>
          <form onSubmit={handleResponseSubmit}>
            <textarea
              value={responseText}
              onChange={handleResponseChange}
              placeholder="Escribe tu respuesta..."
              required
            />
            <button type="submit">Enviar respuesta</button>
          </form>
        </div>
      )}
    </>
  );
};
