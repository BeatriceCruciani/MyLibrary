import { useEffect, useState } from "react";

const API_BASE = "/api/books";

export default function BookEdit({ id, onCancel, onSaved, notify }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [stato, setStato] = useState("da leggere");
  const [utenteId, setUtenteId] = useState("1");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (res.status === 404) throw new Error("Libro non trovato");
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setTitolo(data.titolo ?? "");
          setAutore(data.autore ?? "");
          setStato(data.stato ?? "da leggere");
          setUtenteId(String(data.utente_id ?? "1"));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Errore di rete");
          notify?.(e.message || "Errore di rete", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, notify]);

  function validate() {
    const t = titolo.trim();
    const a = autore.trim();
    const u = Number(utenteId);

    if (t.length < 3) return "Titolo troppo corto (min 3 caratteri).";
    if (a.length < 3) return "Autore troppo corto (min 3 caratteri).";
    if (!Number.isFinite(u) || u <= 0) return "Utente ID non valido.";

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errMsg = validate();
    if (errMsg) {
      notify?.(errMsg, "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        titolo: titolo.trim(),
        autore: autore.trim(),
        stato,
        utente_id: Number(utenteId),
      };

      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Dati non validi");
      }
      if (res.status === 404) throw new Error("Libro non trovato");
      if (!res.ok) throw new Error(`Errore ${res.status}`);

      onSaved();
    } catch (e2) {
      notify?.(e2.message || "Errore salvataggio", "error");
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = !validate();

  return (
    <div className="panel">
      <div className="panelTop">
        <button className="btn" onClick={onCancel}>
          ← Indietro
        </button>
        <div className="hint">Modifica libro</div>
      </div>

      {loading && <div>Caricamento...</div>}
      {error && <div className="alert">⚠️ {error}</div>}

      {!loading && !error && (
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Titolo
            <input
              className="input"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              required
            />
          </label>

          <label className="label">
            Autore
            <input
              className="input"
              value={autore}
              onChange={(e) => setAutore(e.target.value)}
              required
            />
          </label>

          <label className="label">
            Stato
            <select
              className="input"
              value={stato}
              onChange={(e) => setStato(e.target.value)}
            >
              <option value="da leggere">da leggere</option>
              <option value="in lettura">in lettura</option>
              <option value="letto">letto</option>
            </select>
          </label>

          <label className="label">
            Utente ID
            <input
              className="input"
              type="number"
              min="1"
              value={utenteId}
              onChange={(e) => setUtenteId(e.target.value)}
              required
            />
          </label>

          <button className="btn btnPrimary" type="submit" disabled={saving || !canSubmit}>
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </button>
        </form>
      )}
    </div>
  );
}
