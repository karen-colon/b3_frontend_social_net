import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';
import { Global } from '../../helpers/Global';
import { useLocation } from 'react-router-dom';

export const MyPublications = () => {
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [newResponseText, setNewResponseText] = useState('');
  const location = useLocation(); // To detect redirection

  useEffect(() => {
    if (location.state && location.state.newPublication) {
      // If redirected from new publication, reload publications
      getPublications(1, true);
    } else {
      getPublications(1, false);
    }
  }, [location.state]);

  const getPublications = async (nextPage = 1, reset = false) => {
    const token = localStorage.getItem('token');
    const request = await fetch(`${Global.url}publication/publications-user/${auth._id}/${nextPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const data = await request.json();

    if (data.status === 'success') {
      let newPublications = data.publications;

      if (!reset && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }

      setPublications(newPublications);

      if (publications.length >= (data.total - data.publications.length)) {
        setMore(false);
      }

      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };

  const handleResponseChange = (e) => {
    setNewResponseText(e.target.value);
  };

  const submitResponse = async (publicationId) => {
    if (newResponseText.trim()) {
      const token = localStorage.getItem('token');
      const request = await fetch(`${Global.url}publication/response/${publicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ text: newResponseText })
      });

      const data = await request.json();
      if (data.status === 'success') {
        // Reset the response input and refresh the publications
        setNewResponseText('');
        getPublications(1, false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Mis Publicaciones</h1>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        isProfile={true} // This is the profile, not the feed
      />

      <div className="responses">
        {publications.map((publication) => (
          <div key={publication._id}>
            <h3>Respuestas</h3>
            <div>
              {publication.responses && publication.responses.map((response) => (
                <div key={response._id}>
                  <p>{response.text}</p>
                  <p>{response.user.name}</p>
                </div>
              ))}
            </div>
            <div className="response-form">
              <textarea
                value={newResponseText}
                onChange={handleResponseChange}
                placeholder="Escribe tu respuesta..."/>
              <button onClick={() => submitResponse(publication._id)}>Responder</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
