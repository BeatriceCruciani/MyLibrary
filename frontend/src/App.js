/**
 * App (SPA) - componente principale del frontend.
 *
 * Gestisce:
 * - stato globale minimo (lista libri, vista corrente, libro selezionato)
 * - caricamento dati dal backend (GET /api/books)
 * - navigazione interna tra viste (list/detail/create/edit) senza React Router
 */
import { useEffect, useState } from "react";
import "./App.css";

import BookCreate from "./components/BookCreate";
import BookEdit from "./components/BookEdit";
import BookDetail from "./components/BookDetail";
import AuthPage from "./components/AuthPage";

import { apiFetch } from "./api";
import { clearToken, getToken } from "./auth";

function App() {
  // Lista libri dell'utente autenticato
  const [books, setBooks] = useState([]);
  // Libro attualmente selezionato nella sidebar
  const [selectedBook, setSelectedBook] = useState(null);
  // Flag UI: se true mostra la schermata di modifica
  const [isEditing, setIsEditing] = useState(false);

  // Dati utente loggato (es: { id, nome, email })
  const [me, setMe] = useState(null);

  // Stato caricamento e gestione errori
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  /**
   * Carica i dati del profilo dell'utente autenticato.
   * Endpoint protetto: richiede Authorization: Bearer <token>
   */
  async function loadMe() {
    const res = await apiFetch("/api/auth/me");
    setMe(res.user);
  }

  /**
   * Carica i libri dell'utente loggato.
   * Endpoint protetto: ritorna solo i libri di proprietà dell’utente.
   */
  async function loadBooks() {
    const data = await apiFetch("/api/books/me/mine");
    setBooks(data || []);
  }

  /**
   * Bootstrap iniziale:
   * se c'è un token, carica profilo utente e lista libri.
   * Se non c'è token, non carica nulla e verrà mostrata AuthPage.
   */
  async function bootstrap() {
    if (!getToken()) return;
    setLoading(true);
    setError("");
    try {
      await loadMe();
      await loadBooks();
    } catch (err) {
      // In caso di token scaduto/non valido, apiFetch può già pulire il token.
      setError(err.message || "Errore caricamento dati");
    } finally {
      setLoading(false);
    }
  }

  /**
   * useEffect di mount: esegue una sola volta all'avvio dell'app.
   */
  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Logout:
   * - rimuove token
   * - resetta lo stato frontend per tornare alla pagina di login
   */
  function handleLogout() {
    clearToken();
    setMe(null);
    setBooks([]);
    setSelectedBook(null);
    setIsEditing(false);
  }

  /**
   * Callback richiamata da AuthPage dopo login/register avvenuto con successo.
   * Qui l'app aggiorna lo stato utente e carica subito i libri.
   */
  async function handleAuthSuccess(user) {
    setMe(user);
    await loadBooks();
  }

  /**
   * Crea un nuovo libro (POST /api/books)
   * Nota: utente_id non viene inviato dal client perché viene impostato dal backend
   * tramite il token JWT (middleware validateBook).
   */
  async function addBook(newBook) {
    setError("");
    try {
      const created = await apiFetch("/api/books", {
        method: "POST",
        body: JSON.stringify({
          titolo: newBook.titolo,
          autore: newBook.autore,
          stato: newBook.stato,
          // utente_id lo imposta validateBook/backend
        }),
      });

      setBooks((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message || "Errore creazione libro");
    }
  }

  /**
   * Aggiorna un libro (PUT /api/books/:id)
   * Il backend può ritornare { message, book } oppure direttamente il libro.
   */
  async function updateBook(updatedBook) {
    setError("");
    try {
      const res = await apiFetch(`/api/books/${updatedBook.id}`, {
        method: "PUT",
        body: JSON.stringify({
          titolo: updatedBook.titolo,
          autore: updatedBook.autore,
          stato: updatedBook.stato,
        }),
      });

      // backend ritorna: { message, book: {...} }
      const saved = res.book || res;

      setBooks((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
      setSelectedBook(saved);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Errore modifica libro");
    }
  }

  /**
   * Elimina un libro (DELETE /api/books/:id)
   * Dopo l'eliminazione aggiorna la lista e pulisce la selezione se necessario.
   */
  async function deleteBook(bookId) {
    setError("");
    try {
      await apiFetch(`/api/books/${bookId}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      if (selectedBook?.id === bookId) setSelectedBook(null);
    } catch (err) {
      setError(err.message || "Errore eliminazione libro");
    }
  }
  /**
   * Se non esiste un token, mostriamo la pagina di autenticazione.
   * AuthPage si occupa di login/register e, al successo, richiama onAuthSuccess.
   */
  if (!getToken()) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="brand">
          <h1>MyLibrary</h1>
          {(me?.nome || me?.email) && (
            <span className="user-badge">👤 {me.nome || me.email}</span>
          )}
        </div>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Caricamento...</p>}

      <div className="layout">
        <aside className="sidebar">
          <h2>I miei libri</h2>
          <ul className="book-list">
            {books.map((book) => (
              <li key={book.id}>
                <button
                  className={selectedBook?.id === book.id ? "selected" : ""}
                  onClick={() => {
                    setSelectedBook(book);
                    setIsEditing(false);
                  }}
                >
                  {book.titolo}
                </button>
              </li>
            ))}
          </ul>

          <BookCreate onAddBook={addBook} />
        </aside>

        <main className="content">
          {!selectedBook && (
            <div className="empty-state">
              <p>Seleziona un libro dalla lista oppure creane uno nuovo.</p>
            </div>
          )}

          {selectedBook && !isEditing && (
            <BookDetail
              book={selectedBook}
              onEdit={() => setIsEditing(true)}
              onDelete={() => deleteBook(selectedBook.id)}
            />
          )}

          {selectedBook && isEditing && (
            <BookEdit
              book={selectedBook}
              onCancel={() => setIsEditing(false)}
              onUpdateBook={updateBook}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
