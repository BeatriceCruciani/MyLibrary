export default function BookList({ books, onSelect }) {
  if (!Array.isArray(books) || books.length === 0) {
    return <div>Nessun libro presente.</div>;
  }

  return (
    <div className="grid">
      {books.map((b) => (
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
  );
}
