import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "/api/books";

export default function App() {
  const [view, setView] = useState("list"); // "list" | "detail" | "create"
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
      </main>
    </div>
  );
}

function BookList({ books, onSelect }) {
  if (!Array.isArray(books) || books.length === 0) {
    return <div>Nessun libro presente.</div>;
  }

  return (
    <div className="grid">
      {books.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelect(b.id)}
          className="card"
          title="Apri dettaglio"
        >
          <div className="cardTitle">{b.titolo}</div>
          <div className="cardMeta">{b.autore}</div>
          <div className="badge">{b.stato ?? "da leggere"}</div>
        </button>
      ))}
    </div>
  );
}

function BookDetail({ id, onBack, onDeleted }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      setBook(null);

      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (res.status === 404) throw new Error("Libro non trovato");
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const data = await res.json();
        if (!cancelled) setBook(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Errore di rete");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    const ok = window.confirm("Vuoi eliminare questo libro?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      onDeleted();
    } catch (e) {
      alert(e.message || "Errore eliminazione");
    }
  }

  return (
    <div className="panel">
      <div className="panelTop">
        <button className="btn" onClick={onBack}>
          ← Indietro
        </button>
        <button className="btn btnDanger" onClick={handleDelete}>
          Elimina
        </button>
      </div>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && book && (
        <div className="detailBody">
          <h3 className="detailTitle">{book.titolo}</h3>
          <p className="p">
            <b>Autore:</b> {book.autore}
          </p>
          <p className="p">
            <b>Stato:</b> {book.stato}
          </p>
          <p className="p">
            <b>Utente ID:</b> {book.utente_id}
          </p>
          <p className="hint">(Qui poi potremo aggiungere citazioni/recensioni.)</p>
        </div>
      )}
    </div>
  );
}

function BookCreate({ onCancel, onCreated }) {
  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [stato, setStato] = useState("da leggere");
  const [utenteId, setUtenteId] = useState("1");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        titolo: titolo.trim(),
        autore: autore.trim(),
        stato,
        utente_id: Number(utenteId),
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Dati non validi");
      }
      if (!res.ok) throw new Error(`Errore ${res.status}`);

      setTitolo("");
      setAutore("");
      setStato("da leggere");
      setUtenteId("1");

      onCreated();
    } catch (e2) {
      alert(e2.message || "Errore creazione");
    } finally {
      setSaving(false);
    }
  }

  const canSubmit =
    titolo.trim().length > 0 && autore.trim().length > 0 && Number(utenteId) > 0;

  return (
    <div className="panel">
      <div className="panelTop">
        <button className="btn" onClick={onCancel}>
          ← Indietro
        </button>
        <div className="hint">Crea un nuovo libro</div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Titolo
          <input
            className="input"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
          />
        </label>

        <label className="label">
          Autore
          <input
            className="input"
            value={autore}
            onChange={(e) => setAutore(e.target.value)}
            required
          />
        </label>

        <label className="label">
          Stato
          <select
            className="input"
            value={stato}
            onChange={(e) => setStato(e.target.value)}
          >
            <option value="da leggere">da leggere</option>
            <option value="in lettura">in lettura</option>
            <option value="letto">letto</option>
          </select>
        </label>

        <label className="label">
          Utente ID
          <input
            className="input"
            type="number"
            min="1"
            value={utenteId}
            onChange={(e) => setUtenteId(e.target.value)}
            required
          />
        </label>

        <button className="btn btnPrimary" type="submit" disabled={saving || !canSubmit}>
          {saving ? "Salvataggio..." : "Crea"}
        </button>
      </form>
    </div>
  );
}
