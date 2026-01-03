import { useEffect, useRef, useState } from "react";
import "./App.css";

import BookList from "./components/bookList";
import BookDetail from "./components/bookDetail";
import BookCreate from "./components/bookCreate";
import BookEdit from "./components/bookEdit";

const API_BASE = "/api/books";

export default function App() {
  const [view, setView] = useState("list"); // list | detail | create | edit
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ toast
  const [toast, setToast] = useState(null); // { type: "success"|"error", message: string }
  const toastTimer = useRef(null);

  function notify(message, type = "success") {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  async function loadBooks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Errore di rete");
      notify(e.message || "Errore di rete", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
  }

  function openEdit(id) {
    setSelectedId(id);
    setView("edit");
  }

  function openCreate() {
    setSelectedId(null);
    setView("create");
  }

  function backToList() {
    setSelectedId(null);
    setView("list");
  }

  return (
    <div className="page">
      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      <header className="header">
        <h2 className="brand">MyLibrary</h2>

        <div className="headerActions">
          <button className="btn" onClick={backToList}>
            Lista
          </button>
          <button className="btn btnPrimary" onClick={openCreate}>
            + Nuovo
          </button>
          <button className="btn" onClick={loadBooks} title="Ricarica">
            ↻
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="alert">⚠️ {error}</div>}
        {loading && <div>Caricamento...</div>}

        {!loading && view === "list" && (
          <BookList books={books} onSelect={openDetail} />
        )}

        {view === "detail" && selectedId != null && (
          <BookDetail
            id={selectedId}
            onBack={backToList}
            onEdit={() => openEdit(selectedId)}
            onDeleted={() => {
              notify("✅ Libro eliminato");
              backToList();
              loadBooks();
            }}
            notify={notify}
          />
        )}

        {view === "create" && (
          <BookCreate
            onCancel={backToList}
            onCreated={() => {
              notify("✅ Libro creato");
              backToList();
              loadBooks();
            }}
            notify={notify}
          />
        )}

        {view === "edit" && selectedId != null && (
          <BookEdit
            id={selectedId}
            onCancel={() => setView("detail")}
            onSaved={() => {
              notify("✅ Modifiche salvate");
              setView("detail");
              loadBooks();
            }}
            notify={notify}
          />
        )}
      </main>
    </div>
  );
}
