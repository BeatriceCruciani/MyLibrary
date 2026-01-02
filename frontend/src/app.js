import { useEffect, useState } from "react";
import "./App.css";

import BookList from "./components/bookList";
import BookDetail from "./components/bookDetail";
import BookCreate from "./components/bookCreate";
import BookEdit from "./components/bookEdit";

const API_BASE = "/api/books";

export default function App() {
  const [view, setView] = useState("list"); // "list" | "detail" | "create" | "edit"
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
              backToList();
              loadBooks();
            }}
          />
        )}

        {view === "create" && (
          <BookCreate
            onCancel={backToList}
            onCreated={() => {
              backToList();
              loadBooks();
            }}
          />
        )}

        {view === "edit" && selectedId != null && (
          <BookEdit
            id={selectedId}
            onCancel={() => setView("detail")}
            onSaved={() => {
              setView("detail");
              loadBooks();
            }}
          />
        )}
      </main>
    </div>
  );
}
