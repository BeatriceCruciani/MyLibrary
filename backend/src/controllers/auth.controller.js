/**
 * Controller autenticazione (register/login/me)
 * Gestisce creazione utente, verifica credenziali e generazione JWT.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


/**
 * Firma un JWT con i dati minimi necessari.
 * nel token NON inseriamo password o dati sensibili.
 */
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}


/**
 * POST /api/auth/register
 * Registra un nuovo utente.
 * - valida i campi base
 * - verifica email duplicata
 * - salva password hashata (bcrypt)
 * - restituisce token + dati utente
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ error: "Nome non valido" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email non valida" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password minimo 6 caratteri" });
    }

    // controllo unicità email
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email già registrata" });
    }

    // bcrypt: salviamo solo hash, mai la password in chiaro
    const password_hash = await bcrypt.hash(password, 10);
    const id = await User.createUser({ nome, email, password_hash });

    const token = signToken({ id, email });
    return res.status(201).json({ token, user: { id, nome, email } });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Errore registrazione", detail: err.message });
  }
};


/**
 * POST /api/auth/login
 * Verifica credenziali e rilascia un JWT.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password obbligatorie" });
    }

    // recupero utente e confronto password hashata
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    if (!user.password_hash) {
      return res.status(500).json({ error: "Password non impostata per questo utente" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Errore login", detail: err.message });
  }
};


/**
 * GET /api/auth/me
 * Endpoint protetto: restituisce i dati dell'utente autenticato.
 * req.user viene popolato dal middleware auth.
 */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ error: "Errore me", detail: err.message });
  }
};
