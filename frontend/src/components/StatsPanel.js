import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function StatsPanel({ refreshKey = 0 }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/books/me/stats");
      setStats(data);
    } catch (e) {
      setStats(null);
      setError(e?.message || "Impossibile caricare le statistiche.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // refreshKey forza reload quando cambia (es. dopo CRUD)
  }, [refreshKey]);

  return (
    <div className="statsWrap">
      <div className="statsCard">
        <div className="statsHeader">
          <div>
            <div className="statsTitle">Statistiche</div>
            <div className="statsHint">Panoramica dei tuoi libri</div>
          </div>

          <button className="statsBtn" onClick={load} title="Aggiorna">
            Aggiorna
          </button>
        </div>

        {loading && <div className="statsHint">Caricamento…</div>}

        {!loading && error && (
          <>
            <div className="statsError">{error}</div>
            <div className="statsHint">
              (Serve essere loggato e avere il backend attivo)
            </div>
          </>
        )}

        {!loading && !error && stats && (
          <>
            <div className="statsGrid">
              <StatBox label="Totale" value={stats.total} />
              <StatBox label="Da leggere" value={stats.toRead} />
              <StatBox label="In lettura" value={stats.reading} />
              <StatBox label="Letti" value={stats.read} />
            </div>

            {Number(stats.other) > 0 && (
              <div className="statsOther">
                Altri stati / non impostato: <b>{stats.other}</b>
              </div>
            )}

            {stats.byState && Object.keys(stats.byState).length > 0 && (
              <details className="statsDetails">
                <summary>Dettaglio per stato</summary>
                <ul className="statsList">
                  {Object.entries(stats.byState).map(([k, v]) => (
                    <li key={k}>
                      <span className="statsKey">{k}</span>
                      <span className="statsVal">{v}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="statBox">
      <div className="statValue">{Number(value) || 0}</div>
      <div className="statLabel">{label}</div>
    </div>
  );
}
