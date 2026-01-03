import { useEffect, useState } from "react";

export default function BookQuotes({ bookId }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/books/${bookId}/citazioni`);
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const data = await res.json();
        if (!cancelled) setQuotes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Errore caricamento citazioni");
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
      <h4>📌 Citazioni</h4>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && quotes.length === 0 && (
        <div className="hint">Nessuna citazione presente.</div>
      )}

      <ul>
        {quotes.map((q) => (
          <li key={q.id} style={{ marginBottom: 6 }}>
            “{q.testo}”
          </li>
        ))}
      </ul>
    </div>
  );
}
