const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

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

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email già registrata" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = await User.createUser({ nome, email, password_hash });

    const token = signToken({ id, email });
    return res.status(201).json({ token, user: { id, nome, email } });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Errore registrazione", detail: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password obbligatorie" });
    }

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

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ error: "Errore me", detail: err.message });
  }
};
