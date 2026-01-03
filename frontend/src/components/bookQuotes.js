import { useEffect, useState } from "react";

export default function BookQuotes({ bookId }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [testo, setTesto] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadQuotes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/books/${bookId}/citazioni`);
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Errore caricamento citazioni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function handleAdd(e) {
    e.preventDefault();
    const value = testo.trim();
    if (!value) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}/citazioni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testo: value }),
      });

      if (res.status === 400) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Dati non validi");
      }
      if (!res.ok) throw new Error(`Errore ${res.status}`);

      setTesto("");
      await loadQuotes();
    } catch (e2) {
      alert(e2.message || "Errore inserimento citazione");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuote(quoteId) {
    const ok = window.confirm("Eliminare questa citazione?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/books/${bookId}/citazioni/${quoteId}`, {
        method: "DELETE",
      });

      if (res.status === 404) {
        alert("Citazione non trovata (forse già eliminata).");
        await loadQuotes();
        return;
      }

      if (!res.ok) throw new Error(`Errore ${res.status}`);

      await loadQuotes();
    } catch (e) {
      alert(e.message || "Errore eliminazione citazione");
    }
  }

  return (
    <div className="panel">
      <h4>📌 Citazioni</h4>

      <form className="form" onSubmit={handleAdd}>
        <label className="label">
          Aggiungi citazione
          <input
            className="input"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder='Es. "Non tutti quelli che vagano sono perduti"'
          />
        </label>

        <button
          className="btn btnPrimary"
          type="submit"
          disabled={saving || !testo.trim()}
        >
          {saving ? "Salvataggio..." : "Aggiungi"}
        </button>
      </form>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && quotes.length === 0 && (
        <div className="hint">Nessuna citazione presente.</div>
      )}

      {!loading && !error && quotes.length > 0 && (
        <ul style={{ paddingLeft: 18, marginTop: 10 }}>
          {quotes.map((q) => (
            <li
              key={q.id}
              style={{
                marginBottom: 8,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ flex: 1 }}>“{q.testo}”</span>

              <button
                className="btn btnDanger"
                type="button"
                title="Elimina citazione"
                onClick={() => handleDeleteQuote(q.id)}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

