const db = require('../db');

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function beginTransaction() {
  return new Promise((resolve, reject) => {
    db.beginTransaction(err => (err ? reject(err) : resolve()));
  });
}

function commit() {
  return new Promise((resolve, reject) => {
    db.commit(err => (err ? reject(err) : resolve()));
  });
}

function rollback() {
  return new Promise((resolve) => {
    db.rollback(() => resolve());
  });
}

const Book = {
  async findAll() {
    return query('SELECT * FROM libri');
  },

  async findById(id) {
    const results = await query('SELECT * FROM libri WHERE id = ?', [id]);
    return results[0]; // undefined se non esiste
  },

  async create({ titolo, autore, stato, utente_id }) {
    const result = await query(
      'INSERT INTO libri (titolo, autore, stato, utente_id) VALUES (?, ?, ?, ?)',
      [titolo, autore, stato, utente_id]
    );

    return {
      id: result.insertId,
      titolo,
      autore,
      stato,
      utente_id
    };
  },

  async update(id, { titolo, autore, stato, utente_id }) {
    const result = await query(
      'UPDATE libri SET titolo = ?, autore = ?, stato = ?, utente_id = ? WHERE id = ?',
      [titolo, autore, stato, utente_id, id]
    );

    return result.affectedRows > 0;
  },

    async createQuote(bookId, testo) {
    const result = await query(
      "INSERT INTO citazioni (testo, libro_id) VALUES (?, ?)",
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },

  async createReview(bookId, testo) {
    const result = await query(
      "INSERT INTO recensioni (testo, libro_id) VALUES (?, ?)",
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },


    async findQuotesByBookId(bookId) {
    return query(
      'SELECT id, testo, libro_id FROM citazioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
  },

  async findReviewsByBookId(bookId) {
    return query(
      'SELECT id, testo, libro_id FROM recensioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
  },


  /**
   * Cancella libro + figli (citazioni, recensioni) in transazione
   * Ritorna true se ha cancellato, false se il libro non esiste
   */
  async removeCascade(id) {
    try {
      await beginTransaction();

      // Prima controlliamo esistenza libro
      const existing = await query('SELECT id FROM libri WHERE id = ?', [id]);
      if (existing.length === 0) {
        await rollback();
        return false;
      }

      // Elimina figli
      await query('DELETE FROM citazioni WHERE libro_id = ?', [id]);
      await query('DELETE FROM recensioni WHERE libro_id = ?', [id]);

      // Elimina padre
      await query('DELETE FROM libri WHERE id = ?', [id]);

      await commit();
      return true;
    } catch (err) {
      await rollback();
      throw err;
    }
  }
};

module.exports = Book;
