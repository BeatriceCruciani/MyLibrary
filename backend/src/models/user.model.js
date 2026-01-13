/**
 * Model Utente (data access layer)
 * Query SQL per utenti.
 */
const db = require("../db");

/**
 * Cerca un utente per email.
 * Usato in login e register (controllo duplicati).
 */
async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM utenti WHERE email = ?", [email]);
  return rows[0];
}

/**
 * Recupera dati pubblici utente (senza password_hash).
 * Usato in /me.
 */
async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, nome, email FROM utenti WHERE id = ?",
    [id]
  );
  return rows[0];
}

/**
 * Crea un utente.
 * Salva password_hash (mai password in chiaro).
 */
async function createUser({ nome, email, password_hash }) {
  const [result] = await db.query(
    "INSERT INTO utenti (nome, email, password_hash) VALUES (?, ?, ?)",
    [nome, email, password_hash]
  );
  return result.insertId;
}

module.exports = { findByEmail, findById, createUser };

