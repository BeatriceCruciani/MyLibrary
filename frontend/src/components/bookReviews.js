import { useEffect, useState } from "react";

export default function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/books/${bookId}/recensioni`);
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const data = await res.json();
        if (!cancelled) setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Errore caricamento recensioni");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  return (
    <div className="panel">
      <h4>⭐ Recensioni</h4>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && reviews.length === 0 && (
        <div className="hint">Nessuna recensione presente.</div>
      )}

      <ul>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: 6 }}>
            {r.testo}
          </li>
        ))}
      </ul>
    </div>
  );
}
