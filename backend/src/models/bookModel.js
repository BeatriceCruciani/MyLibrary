const db = require('../db');

const Book = {
  //  BOOKS

  async findAll() {
    const [rows] = await db.query('SELECT * FROM libri ORDER BY id DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM libri WHERE id = ?', [id]);
    return rows[0];
  },

  async findAllByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM libri WHERE utente_id = ? ORDER BY id DESC',
      [userId]
    );
    return rows;
  },

  async create({ titolo, autore, stato, utente_id }) {
    const [result] = await db.query(
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

  // Aggiorna SOLO se il libro appartiene all'utente
  async update(id, { titolo, autore, stato, utente_id }) {
    const [result] = await db.query(
      `UPDATE libri
       SET titolo = ?, autore = ?, stato = ?
       WHERE id = ? AND utente_id = ?`,
      [titolo, autore, stato, id, utente_id]
    );

    return result.affectedRows > 0;
  },

  // Elimina SOLO se il libro appartiene all'utente
  async remove(id, utente_id) {
    const [result] = await db.query(
      'DELETE FROM libri WHERE id = ? AND utente_id = ?',
      [id, utente_id]
    );
    return result.affectedRows > 0;
  },

  //  CITAZIONI
    
  async createQuote(bookId, testo) {
    const [result] = await db.query(
      'INSERT INTO citazioni (testo, libro_id) VALUES (?, ?)',
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },

  async findQuotesByBookId(bookId) {
    const [rows] = await db.query(
      'SELECT id, testo, libro_id FROM citazioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
    return rows;
  },

  async deleteQuote(bookId, quoteId) {
    const [result] = await db.query(
      'DELETE FROM citazioni WHERE id = ? AND libro_id = ?',
      [quoteId, bookId]
    );
    return result.affectedRows > 0;
  },

  //  RECENSIONI
    
  async createReview(bookId, testo) {
    const [result] = await db.query(
      'INSERT INTO recensioni (testo, libro_id) VALUES (?, ?)',
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },

  async findReviewsByBookId(bookId) {
    const [rows] = await db.query(
      'SELECT id, testo, libro_id FROM recensioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
    return rows;
  },

  async deleteReview(bookId, reviewId) {
    const [result] = await db.query(
      'DELETE FROM recensioni WHERE id = ? AND libro_id = ?',
      [reviewId, bookId]
    );
    return result.affectedRows > 0;
  },

  //  DELETE CASCADE (LIBRO + FIGLI)
    // - transazione
    // - ownership check
    
  async removeCascade(id, utente_id) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Controllo esistenza + ownership
      const [existing] = await conn.query(
        'SELECT id FROM libri WHERE id = ? AND utente_id = ?',
        [id, utente_id]
      );

      if (existing.length === 0) {
        await conn.rollback();
        return false;
      }

      // Elimina figli
      await conn.query('DELETE FROM citazioni WHERE libro_id = ?', [id]);
      await conn.query('DELETE FROM recensioni WHERE libro_id = ?', [id]);

      // Elimina padre
      await conn.query('DELETE FROM libri WHERE id = ?', [id]);

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = Book;
