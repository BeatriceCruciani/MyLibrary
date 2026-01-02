import { useState } from "react";

const API_BASE = "/api/books";

export default function BookCreate({ onCancel, onCreated }) {
  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [stato, setStato] = useState("da leggere");
  const [utenteId, setUtenteId] = useState("1");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        titolo: titolo.trim(),
        autore: autore.trim(),
        stato,
        utente_id: Number(utenteId),
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Dati non validi");
      }
      if (!res.ok) throw new Error(`Errore ${res.status}`);

      setTitolo("");
      setAutore("");
      setStato("da leggere");
      setUtenteId("1");

      onCreated();
    } catch (e2) {
      alert(e2.message || "Errore creazione");
    } finally {
      setSaving(false);
    }
  }

  const canSubmit =
    titolo.trim().length > 0 && autore.trim().length > 0 && Number(utenteId) > 0;

  return (
    <div className="panel">
      <div className="panelTop">
        <button className="btn" onClick={onCancel}>
          ← Indietro
        </button>
        <div className="hint">Crea un nuovo libro</div>
      </div>

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
          {saving ? "Salvataggio..." : "Crea"}
        </button>
      </form>
    </div>
  );
}
