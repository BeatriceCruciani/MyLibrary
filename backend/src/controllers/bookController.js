/**
 * Controller libri / citazioni / recensioni
 * logica applicativa delle API (REST).
 */
const Book = require('../models/bookModel');

/**
 * GET /api/books
 * Endpoint pubblico: restituisce tutti i libri.
 */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error('getAllBooks error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * GET /api/books/me/mine
 * Endpoint protetto: restituisce solo i libri dell'utente autenticato.
 * req.user viene popolato dal middleware auth (JWT).
 */
exports.getMyBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await Book.findAllByUser(userId);
    res.json(books);
  } catch (err) {
    console.error('getMyBooks error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * GET /api/books/:id
 * Endpoint pubblico: recupera un libro per ID.
 */
exports.getBookById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }

    res.json(book);
  } catch (err) {
    console.error('getBookById error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * POST /api/books
 * Endpoint protetto: crea un libro.
 * validateBook normalizza i campi e imposta sempre utente_id dal token JWT.
 */
exports.createBook = async (req, res) => {
  try {
    // validateBook già normalizza titolo/autore/stato e imposta utente_id = req.user.id
    const { titolo, autore, stato, utente_id } = req.body;

    const created = await Book.create({
      titolo,
      autore,
      stato,
      utente_id
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('createBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * PUT /api/books/:id
 * Endpoint protetto: aggiorna un libro solo se appartiene all'utente autenticato.
 * Il controllo ownership è nella query (WHERE id=? AND utente_id=?).
 */
exports.updateBook = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // validateBook già normalizza + imposta utente_id dal token
    const { titolo, autore, stato, utente_id } = req.body;

    const ok = await Book.update(id, {
      titolo,
      autore,
      stato,
      utente_id
    });

    if (!ok) {
      // può essere libro non esiste oppure non è tuo
      return res.status(404).json({ error: 'Libro non trovato o non autorizzato' });
    }

    res.json({
      message: 'Libro aggiornato con successo',
      book: { id, titolo, autore, stato, utente_id }
    });
  } catch (err) {
    console.error('updateBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * GET /api/books/:id/citazioni
 * Endpoint pubblico: elenco citazioni del libro.
 */
exports.getBookQuotes = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const quotes = await Book.findQuotesByBookId(id);
    res.json(quotes);
  } catch (err) {
    console.error('getBookQuotes error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * GET /api/books/:id/recensioni
 * Endpoint pubblico: elenco recensioni del libro.
 */
exports.getBookReviews = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reviews = await Book.findReviewsByBookId(id);
    res.json(reviews);
  } catch (err) {
    console.error('getBookReviews error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * Helper: verifica che il libro esista.
 * Utile per le rotte protette su citazioni/recensioni.
 */
async function ensureBookExists(bookId) {
  const book = await Book.findById(bookId);
  return book;
}


/**
 * POST /api/books/:id/citazioni
 * Endpoint protetto: aggiunge una citazione al libro.
 * Opzionale: enforcement ownership (solo proprietario può inserire).
 */
exports.createBookQuote = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const { testo } = req.body;

    if (!testo || !testo.trim()) {
      return res.status(400).json({ error: 'testo è obbligatorio' });
    }

    const book = await ensureBookExists(bookId);
    if (!book) return res.status(404).json({ error: 'Libro non trovato' });

    if (book.utente_id !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    const created = await Book.createQuote(bookId, testo.trim());
    res.status(201).json(created);
  } catch (err) {
    console.error('createBookQuote error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * POST /api/books/:id/recensioni
 * Endpoint protetto: aggiunge una recensione al libro.
 * ownership check come sopra.
 */
exports.createBookReview = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const { testo } = req.body;

    if (!testo || !testo.trim()) {
      return res.status(400).json({ error: 'testo è obbligatorio' });
    }

    const book = await ensureBookExists(bookId);
    if (!book) return res.status(404).json({ error: 'Libro non trovato' });

    if (book.utente_id !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    const created = await Book.createReview(bookId, testo.trim());
    res.status(201).json(created);
  } catch (err) {
    console.error('createBookReview error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * DELETE /api/books/:id/citazioni/:quoteId
 * Endpoint protetto: elimina una citazione se il libro è dell'utente.
 */
exports.deleteBookQuote = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const quoteId = Number(req.params.quoteId);

    if (!Number.isInteger(quoteId) || quoteId <= 0) {
      return res.status(400).json({ error: 'quoteId non valido' });
    }

    const book = await ensureBookExists(bookId);
    if (!book) return res.status(404).json({ error: 'Libro non trovato' });

    if (book.utente_id !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    const ok = await Book.deleteQuote(bookId, quoteId);
    if (!ok) return res.status(404).json({ error: 'Citazione non trovata' });

    res.json({ message: 'Citazione eliminata con successo' });
  } catch (err) {
    console.error('deleteBookQuote error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * DELETE /api/books/:id/recensioni/:reviewId
 * Endpoint protetto: elimina una recensione se il libro è dell'utente.
 */
exports.deleteBookReview = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const reviewId = Number(req.params.reviewId);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({ error: 'reviewId non valido' });
    }

    const book = await ensureBookExists(bookId);
    if (!book) return res.status(404).json({ error: 'Libro non trovato' });

    if (book.utente_id !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato' });
    }

    const ok = await Book.deleteReview(bookId, reviewId);
    if (!ok) return res.status(404).json({ error: 'Recensione non trovata' });

    res.json({ message: 'Recensione eliminata con successo' });
  } catch (err) {
    console.error('deleteBookReview error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


/**
 * DELETE /api/books/:id
 * Endpoint protetto: elimina libro + figli (citazioni/recensioni) in transazione.
 */
exports.deleteBook = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const ok = await Book.removeCascade(id, req.user.id);
    if (!ok) {
      return res.status(404).json({ error: 'Libro non trovato o non autorizzato' });
    }

    res.json({ message: 'Libro eliminato con successo' });
  } catch (err) {
    console.error('deleteBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};

/**
 * GET /api/books/me/stats
 * Endpoint protetto: statistiche dei libri dell'utente autenticato.
 */
exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Book.getStatsByUser(userId);

    // opzionale: macro contatori standard (comodi lato frontend)
    const normalized = (s) => String(s || '').toLowerCase().trim();

    let toRead = 0;
    let reading = 0;
    let read = 0;
    let other = 0;

    for (const [state, count] of Object.entries(stats.byState)) {
      const st = normalized(state);

      if (['da_leggere', 'da leggere', 'to_read', 'da-leggere'].includes(st)) toRead += count;
      else if (['in_lettura', 'in lettura', 'reading', 'in-lettura'].includes(st)) reading += count;
      else if (['letto', 'letti', 'read'].includes(st)) read += count;
      else other += count;
    }

    res.json({
      total: stats.total,
      toRead,
      reading,
      read,
      other,
      byState: stats.byState
    });
  } catch (err) {
    console.error('getMyStats error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};
