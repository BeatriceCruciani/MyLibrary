import { useEffect, useState } from "react";
import BookQuotes from "./bookQuotes";
import BookReviews from "./bookReviews";

const API_BASE = "/api/books";

export default function BookDetail({ id, onBack, onEdit, onDeleted }) {
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

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn"
            onClick={onEdit}
            disabled={!book || loading || !!error}
            title="Modifica questo libro"
          >
            Modifica
          </button>
          <button className="btn btnDanger" onClick={handleDelete}>
            Elimina
          </button>
        </div>
      </div>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && book && (
        <>
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
          </div>

          {/* Liste collegate al libro */}
          <BookQuotes bookId={id} />
          <BookReviews bookId={id} />
        </>
      )}
    </div>
  );
}
