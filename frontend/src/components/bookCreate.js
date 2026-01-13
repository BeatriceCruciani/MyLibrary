/**
 * BookCreate — form di creazione di un libro.
 *
 * Responsabilità:
 * - gestire lo stato del form (titolo/autore/stato)
 * - validazione minima lato client (coerenza UX)
 * - inviare i dati al parent via onAddBook(newBook)
 *
 * Nota: la chiamata POST viene effettuata in App.js (addBook) per centralizzare la logica.
 */
import { useState } from "react";

export default function BookCreate({ onAddBook }) {
  const [form, setForm] = useState({
    titolo: "",
    autore: "",
    stato: "da leggere",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await onAddBook({
        titolo: form.titolo.trim(),
        autore: form.autore.trim(),
        stato: form.stato.trim(),
      });

      setForm({ titolo: "", autore: "", stato: "da leggere" });
    } catch (err) {
      setError(err.message || "Errore creazione libro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Aggiungi libro</h3>

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

        <button type="submit" disabled={!isValid || loading}>
          {loading ? "Aggiungo..." : "Aggiungi"}
        </button>
      </form>
    </div>
  );
}
