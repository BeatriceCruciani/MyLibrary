import { useEffect, useState } from "react";

export default function BookQuotes({ bookId, notify }) {
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

  const trimmed = testo.trim();
  const isValid = trimmed.length >= 3;
  const showValidation = testo.length > 0 && !isValid;

  async function handleAdd(e) {
    e.preventDefault();
    if (!isValid) {
      notify?.("Citazione troppo corta (min 3 caratteri).", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}/citazioni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testo: trimmed }),
      });

      if (res.status === 400) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Dati non validi");
      }
      if (!res.ok) throw new Error(`Errore ${res.status}`);

      setTesto("");
      await loadQuotes();
      notify?.("✅ Citazione aggiunta");
    } catch (e2) {
      notify?.(e2.message || "Errore inserimento citazione", "error");
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
        notify?.("Citazione non trovata (forse già eliminata).", "error");
        await loadQuotes();
        return;
      }

      if (!res.ok) throw new Error(`Errore ${res.status}`);

      await loadQuotes();
      notify?.("🗑 Citazione eliminata");
    } catch (e) {
      notify?.(e.message || "Errore eliminazione citazione", "error");
    }
  }

  return (
    <div className="panel">
      <h4>📌 Citazioni</h4>

      <form className="form" onSubmit={handleAdd}>
        <label className="label">
          Aggiungi citazione
          <input
            className={`input ${showValidation ? "inputError" : ""}`}
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder='Es. "Non tutti quelli che vagano sono perduti"'
          />

          {showValidation && (
            <div className="fieldError" style={{ marginTop: 6 }}>
              Minimo 3 caratteri
            </div>
          )}
        </label>

        <button
          className="btn btnPrimary"
          type="submit"
          disabled={saving || !isValid}
          title={!isValid ? "Inserisci almeno 3 caratteri" : "Aggiungi citazione"}
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
