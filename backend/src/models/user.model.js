const db = require("../db");

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM utenti WHERE email = ?", [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, nome, email FROM utenti WHERE id = ?",
    [id]
  );
  return rows[0];
}

async function createUser({ nome, email, password_hash }) {
  const [result] = await db.query(
    "INSERT INTO utenti (nome, email, password_hash) VALUES (?, ?, ?)",
    [nome, email, password_hash]
  );
  return result.insertId;
}

module.exports = { findByEmail, findById, createUser };

