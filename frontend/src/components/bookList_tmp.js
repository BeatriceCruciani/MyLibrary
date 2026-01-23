/**
 * BookList — componente lista + filtri/ricerca (UI).
 *
 * Responsabilità:
 * - gestire filtri lato client (stato: tutti/da leggere/in lettura/letto)
 * - gestire ricerca per titolo/autore
 * - mostrare una lista filtrata e “pulita” dei libri
 */
import { useMemo, useState } from "react";

export default function BookList({ books, onSelect }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("tutti"); // tutti | da leggere | in lettura | letto

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return (Array.isArray(books) ? books : []).filter((b) => {
      const matchesStatus = status === "tutti" ? true : b.stato === status;

      const matchesQuery =
        query.length === 0
          ? true
          : `${b.titolo ?? ""} ${b.autore ?? ""}`.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [books, q, status]);

  return (
    <div>
      <div className="listControls">
        <input
          className="input"
          placeholder="Cerca per titolo o autore..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          title="Filtra per stato"
        >
          <option value="tutti">Tutti gli stati</option>
          <option value="da leggere">da leggere</option>
          <option value="in lettura">in lettura</option>
          <option value="letto">letto</option>
        </select>
      </div>

      <div className="hint" style={{ marginTop: 8 }}>
        Risultati: {filtered.length}
      </div>

      {filtered.length === 0 ? (
        <div style={{ marginTop: 12 }}>Nessun libro trovato.</div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {filtered.map((b) => (
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
      )}
    </div>
  );
}
