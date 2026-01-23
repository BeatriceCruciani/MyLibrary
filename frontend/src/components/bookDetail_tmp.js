/**
 * BookDetail — visualizza i dettagli del libro selezionato.
 *
 * Responsabilità:
 * - mostrare i dati principali del libro
 * - fornire azioni "Modifica" e "Elimina" tramite callback del parent
 * - includere i componenti BookQuotes e BookReviews (feature per libro)
 */
import BookQuotes from "./bookQuotes";
import BookReviews from "./bookReviews";

export default function BookDetail({ book, onEdit, onDelete }) {
  if (!book) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2>{book.titolo}</h2>
          <p>
            <strong>Autore:</strong> {book.autore}
          </p>
          <p>
            <strong>Stato:</strong> {book.stato}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <button onClick={onEdit}>Modifica</button>
          <button onClick={onDelete}>Elimina</button>
        </div>
      </div>

      <hr />

      <BookQuotes bookId={book.id} />
      <hr />
      <BookReviews bookId={book.id} />
    </div>
  );
}
