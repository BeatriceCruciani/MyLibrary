import { useEffect, useState } from "react";

export default function BookEdit({ book, onCancel, onUpdateBook }) {
  const [form, setForm] = useState({ titolo: "", autore: "", stato: "da leggere" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!book) return;
    setForm({
      titolo: book.titolo || "",
      autore: book.autore || "",
      stato: book.stato || "da leggere",
    });
  }, [book]);

  const isValid = form.titolo.trim().length > 0 && form.autore.trim().length > 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Titolo e autore sono obbligatori.");
      return;
    }

    try {
      setLoading(true);
      await onUpdateBook({
        ...book,
        titolo: form.titolo.trim(),
        autore: form.autore.trim(),
        stato: form.stato.trim(),
      });
    } catch (err) {
      setError(err.message || "Errore aggiornamento libro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Modifica libro</h2>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          name="titolo"
          placeholder="Titolo"
          value={form.titolo}
          onChange={handleChange}
        />

        <input
          type="text"
          name="autore"
          placeholder="Autore"
          value={form.autore}
          onChange={handleChange}
        />

        <label style={{ display: "grid", gap: 6 }}>
          Stato
          <select name="stato" value={form.stato} onChange={handleChange}>
            <option value="da leggere">Da leggere</option>
            <option value="in lettura">In lettura</option>
            <option value="letto">Letto</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button type="submit" disabled={!isValid || loading}>
            {loading ? "Salvo..." : "Salva"}
          </button>
          <button type="button" onClick={onCancel}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
