import { useEffect, useState } from "react";

export default function BookReviews({ bookId, notify }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [testo, setTesto] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadReviews() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/books/${bookId}/recensioni`);
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Errore caricamento recensioni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const trimmed = testo.trim();
  const isValid = trimmed.length >= 3;
  const showValidation = testo.length > 0 && !isValid;

  async function handleAdd(e) {
    e.preventDefault();
    if (!isValid) {
      notify?.("Recensione troppo corta (min 3 caratteri).", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}/recensioni`, {
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
      await loadReviews();
      notify?.("✅ Recensione aggiunta");
    } catch (e2) {
      notify?.(e2.message || "Errore inserimento recensione", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    const ok = window.confirm("Eliminare questa recensione?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/books/${bookId}/recensioni/${reviewId}`, {
        method: "DELETE",
      });

      if (res.status === 404) {
        notify?.("Recensione non trovata (forse già eliminata).", "error");
        await loadReviews();
        return;
      }

      if (!res.ok) throw new Error(`Errore ${res.status}`);

      await loadReviews();
      notify?.("🗑 Recensione eliminata");
    } catch (e) {
      notify?.(e.message || "Errore eliminazione recensione", "error");
    }
  }

  return (
    <div className="panel">
      <h4>⭐ Recensioni</h4>

      <form className="form" onSubmit={handleAdd}>
        <label className="label">
          Aggiungi recensione
          <input
            className={`input ${showValidation ? "inputError" : ""}`}
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="Scrivi una breve recensione..."
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
          title={!isValid ? "Inserisci almeno 3 caratteri" : "Aggiungi recensione"}
        >
          {saving ? "Salvataggio..." : "Aggiungi"}
        </button>
      </form>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && reviews.length === 0 && (
        <div className="hint">Nessuna recensione presente.</div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <ul style={{ paddingLeft: 18, marginTop: 10 }}>
          {reviews.map((r) => (
            <li
              key={r.id}
              style={{
                marginBottom: 8,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ flex: 1 }}>{r.testo}</span>

              <button
                className="btn btnDanger"
                type="button"
                title="Elimina recensione"
                onClick={() => handleDeleteReview(r.id)}
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
