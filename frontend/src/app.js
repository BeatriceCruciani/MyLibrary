import { useEffect, useState } from "react";
import "./App.css";

import BookCreate from "./components/bookCreate";
import BookEdit from "./components/bookEdit";
import BookDetail from "./components/bookDetail";
import AuthPage from "./components/authPage"; // <-- coerente col tuo nome file

import { apiFetch } from "./api";
import { clearToken, getToken } from "./auth";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // me = { id, nome, email, ... }
  const [me, setMe] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMe() {
    const res = await apiFetch("/api/auth/me");
    setMe(res.user);
  }

  async function loadBooks() {
    const data = await apiFetch("/api/books/me/mine");
    setBooks(data || []);
  }

  async function bootstrap() {
    if (!getToken()) return;
    setLoading(true);
    setError("");
    try {
      await loadMe();
      await loadBooks();
    } catch (err) {
      setError(err.message || "Errore caricamento dati");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    clearToken();
    setMe(null);
    setBooks([]);
    setSelectedBook(null);
    setIsEditing(false);
  }

  async function handleAuthSuccess(user) {
    setMe(user);
    await loadBooks();
  }

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
