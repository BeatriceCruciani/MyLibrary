/**
 * BookReviews — gestione recensioni associate a un libro.
 *
 * Responsabilità:
 * - caricare recensioni dal backend: GET /api/books/:id/recensioni
 * - aggiungere recensione: POST /api/books/:id/recensioni
 * - aggiornare la UI senza ricaricare la pagina
 */
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [testo, setTesto] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isValid = testo.trim().length > 0;

  async function loadReviews() {
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch(`/api/books/${bookId}/recensioni`);
      setReviews(data || []);
    } catch (err) {
      setError(err.message || "Errore caricamento recensioni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!bookId) return;
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  async function addReview(e) {
    e.preventDefault();
    setError("");
    if (!isValid) return;

    try {
      setSaving(true);
      const created = await apiFetch(`/api/books/${bookId}/recensioni`, {
        method: "POST",
        body: JSON.stringify({ testo: testo.trim() }),
      });

      setReviews((prev) => [...prev, created]);
      setTesto("");
    } catch (err) {
      setError(err.message || "Errore aggiunta recensione");
    } finally {
      setSaving(false);
    }
  }

  async function deleteReview(reviewId) {
    setError("");
    try {
      await apiFetch(`/api/books/${bookId}/recensioni/${reviewId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err.message || "Errore eliminazione recensione");
    }
  }

  return (
    <div>
      <h3>Recensioni</h3>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Carico recensioni...</p>}

      <form onSubmit={addReview} style={{ display: "flex", gap: 8 }}>
        <input
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi una recensione"
          style={{ flex: 1 }}
        />
        <button disabled={!isValid || saving}>{saving ? "..." : "Aggiungi"}</button>
      </form>

      <ul>
        {reviews.map((r) => (
          <li key={r.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ flex: 1 }}>{r.testo}</span>
            <button onClick={() => deleteReview(r.id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
