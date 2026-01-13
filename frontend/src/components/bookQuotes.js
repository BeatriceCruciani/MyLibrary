/**
 * BookQuotes — gestione citazioni associate a un libro.
 *
 * Responsabilità:
 * - caricare citazioni dal backend: GET /api/books/:id/citazioni
 * - aggiungere citazione: POST /api/books/:id/citazioni
 * - aggiornare la UI senza ricaricare la pagina
 */
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function BookQuotes({ bookId }) {
  const [quotes, setQuotes] = useState([]);
  const [testo, setTesto] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isValid = testo.trim().length > 0;

  async function loadQuotes() {
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch(`/api/books/${bookId}/citazioni`);
      setQuotes(data || []);
    } catch (err) {
      setError(err.message || "Errore caricamento citazioni");
    } finally {
      setLoading(false);
    }
  }

  // Carica citazioni quando cambia bookId
  useEffect(() => {
    if (!bookId) return;
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function addQuote(e) {
    e.preventDefault();
    setError("");
    if (!isValid) return;

    try {
      setSaving(true);
      const created = await apiFetch(`/api/books/${bookId}/citazioni`, {
        method: "POST",
        body: JSON.stringify({ testo: testo.trim() }),
      });

      // aggiorna lista (nuova citazione in cima)
      setQuotes((prev) => [...prev, created]);
      setTesto("");
    } catch (err) {
      setError(err.message || "Errore aggiunta citazione");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuote(quoteId) {
    setError("");
    try {
      await apiFetch(`/api/books/${bookId}/citazioni/${quoteId}`, { method: "DELETE" });
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    } catch (err) {
      setError(err.message || "Errore eliminazione citazione");
    }
  }

  return (
    <div>
      <h3>Citazioni</h3>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Carico citazioni...</p>}

      <form onSubmit={addQuote} style={{ display: "flex", gap: 8 }}>
        <input
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi una citazione"
          style={{ flex: 1 }}
        />
        <button disabled={!isValid || saving}>{saving ? "..." : "Aggiungi"}</button>
      </form>

      <ul>
        {quotes.map((q) => (
          <li key={q.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ flex: 1 }}>{q.testo}</span>
            <button onClick={() => deleteQuote(q.id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
