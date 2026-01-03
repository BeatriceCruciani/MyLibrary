const Book = require('../models/bookModel');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error('getAllBooks error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};

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

exports.createBook = async (req, res) => {
  try {
    const { titolo, autore, stato, utente_id } = req.body;

    // validazione minima (poi possiamo spostarla in middleware)
    if (!titolo || !autore || !utente_id) {
      return res.status(400).json({
        error: 'titolo, autore e utente_id sono obbligatori'
      });
    }

    const statoFinale = stato || 'da leggere';

    const created = await Book.create({
      titolo,
      autore,
      stato: statoFinale,
      utente_id
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('createBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titolo, autore, stato, utente_id } = req.body;

    if (!titolo || !autore || !utente_id) {
      return res.status(400).json({
        error: 'titolo, autore e utente_id sono obbligatori'
      });
    }

    const statoFinale = stato || 'da leggere';

    const ok = await Book.update(id, {
      titolo,
      autore,
      stato: statoFinale,
      utente_id
    });

    if (!ok) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }

    res.json({
      message: 'Libro aggiornato con successo',
      book: { id, titolo, autore, stato: statoFinale, utente_id }
    });
  } catch (err) {
    console.error('updateBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};

// POST /api/books/:id/citazioni
exports.createBookQuote = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const { testo } = req.body;

    if (!testo || !testo.trim()) {
      return res.status(400).json({ error: "testo è obbligatorio" });
    }

    const created = await Book.createQuote(bookId, testo.trim());
    return res.status(201).json(created);
  } catch (err) {
    console.error("createBookQuote error:", err);
    return res.status(500).json({ error: "Errore database" });
  }
};

// POST /api/books/:id/recensioni
exports.createBookReview = async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const { testo } = req.body;

    if (!testo || !testo.trim()) {
      return res.status(400).json({ error: "testo è obbligatorio" });
    }

    const created = await Book.createReview(bookId, testo.trim());
    return res.status(201).json(created);
  } catch (err) {
    console.error("createBookReview error:", err);
    return res.status(500).json({ error: "Errore database" });
  }
};


exports.getBookQuotes = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const quotes = await Book.findQuotesByBookId(id);

    // ritorniamo sempre un array (anche vuoto)
    res.json(quotes);
  } catch (err) {
    console.error('getBookQuotes error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};

exports.getBookReviews = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const reviews = await Book.findReviewsByBookId(id);

    // ritorniamo sempre un array (anche vuoto)
    res.json(reviews);
  } catch (err) {
    console.error('getBookReviews error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const ok = await Book.removeCascade(id);

    if (!ok) {
      return res.status(404).json({ error: 'Libro non trovato' });
    }

    res.json({ message: 'Libro eliminato con successo' });
  } catch (err) {
    console.error('deleteBook error:', err);
    res.status(500).json({ error: 'Errore database' });
  }
};
