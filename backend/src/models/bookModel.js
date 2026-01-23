/**
 * Model Libro (data access layer)
 * Contiene tutte le query SQL relative a:
 * - libri
 * - citazioni
 * - recensioni
 *
 * qui NON ci sono res/req, solo accesso al DB.
 */
const db = require('../db');

const Book = {
  /**
   * Recupera tutti i libri.
   */
  async findAll() {
    const [rows] = await db.query('SELECT * FROM libri ORDER BY id DESC');
    return rows;
  },

  /**
   * Recupera un libro per ID.
   */
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM libri WHERE id = ?', [id]);
    return rows[0];
  },

  /**
   * Recupera i libri appartenenti a uno specifico utente.
   */
  async findAllByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM libri WHERE utente_id = ? ORDER BY id DESC',
      [userId]
    );
    return rows;
  },

    /**
   * Statistiche dei libri per uno specifico utente.
   * Ritorna:
   * - total: totale libri
   * - byState: mappa stato -> count
   */
  async getStatsByUser(userId) {
    // Totale
    const [[totalRow]] = await db.query(
      'SELECT COUNT(*) AS total FROM libri WHERE utente_id = ?',
      [userId]
    );

    // Raggruppate per stato
    const [rows] = await db.query(
      `SELECT stato, COUNT(*) AS count
       FROM libri
       WHERE utente_id = ?
       GROUP BY stato`,
      [userId]
    );

    const byState = {};
    for (const r of rows) {
      // r.stato può essere NULL/'' se nel DB ci sono record vecchi
      const key = r.stato && String(r.stato).trim() ? String(r.stato).trim() : 'non_impostato';
      byState[key] = Number(r.count);
    }

    return {
      total: Number(totalRow?.total || 0),
      byState
    };
  },


  /**
   * Crea un libro e restituisce l'oggetto creato.
   */
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

  /**
   * Aggiorna un libro SOLO se appartiene all'utente (ownership check in SQL).
   * Ritorna true se almeno una riga è stata modificata.
   */
  async update(id, { titolo, autore, stato, utente_id }) {
    const [result] = await db.query(
      `UPDATE libri
       SET titolo = ?, autore = ?, stato = ?
       WHERE id = ? AND utente_id = ?`,
      [titolo, autore, stato, id, utente_id]
    );

    return result.affectedRows > 0;
  },

  /**
   * Elimina un libro SOLO se appartiene all'utente.
   */
  async remove(id, utente_id) {
    const [result] = await db.query(
      'DELETE FROM libri WHERE id = ? AND utente_id = ?',
      [id, utente_id]
    );
    return result.affectedRows > 0;
  },

  
  /**
   * Inserisce una citazione per un libro.
   */
  async createQuote(bookId, testo) {
    const [result] = await db.query(
      'INSERT INTO citazioni (testo, libro_id) VALUES (?, ?)',
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },

  /**
   * Recupera tutte le citazioni di un libro.
   */
  async findQuotesByBookId(bookId) {
    const [rows] = await db.query(
      'SELECT id, testo, libro_id FROM citazioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
    return rows;
  },

  /**
   * Elimina una citazione (vincolata al libro).
   */
  async deleteQuote(bookId, quoteId) {
    const [result] = await db.query(
      'DELETE FROM citazioni WHERE id = ? AND libro_id = ?',
      [quoteId, bookId]
    );
    return result.affectedRows > 0;
  },

  
  /**
   * Inserisce una recensione per un libro.
   */  
  async createReview(bookId, testo) {
    const [result] = await db.query(
      'INSERT INTO recensioni (testo, libro_id) VALUES (?, ?)',
      [testo, bookId]
    );

    return { id: result.insertId, testo, libro_id: bookId };
  },

  /**
   * Recupera tutte le recensioni di un libro.
   */
  async findReviewsByBookId(bookId) {
    const [rows] = await db.query(
      'SELECT id, testo, libro_id FROM recensioni WHERE libro_id = ? ORDER BY id DESC',
      [bookId]
    );
    return rows;
  },

  /**
   * Elimina una recensione (vincolata al libro).
   */
  async deleteReview(bookId, reviewId) {
    const [result] = await db.query(
      'DELETE FROM recensioni WHERE id = ? AND libro_id = ?',
      [reviewId, bookId]
    );
    return result.affectedRows > 0;
  },

  /**
   * DELETE CASCADE
   * Elimina un libro e i suoi record figli (citazioni/recensioni) in transazione.
   * - controlla ownership
   * - elimina prima le tabelle figlie
   * - poi elimina il libro
   *
   * Ritorna true se eliminato, false se non esiste o non autorizzato.
   */
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
