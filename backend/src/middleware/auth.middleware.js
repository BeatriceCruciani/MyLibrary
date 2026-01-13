/**
 * Middleware di autenticazione JWT.
 * - Legge Authorization: Bearer <token>
 * - Verifica firma e scadenza del token
 * - Se valido, inserisce il payload in req.user
 */
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  // formato atteso: "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const token = header.split(" ")[1];

  try {
    // jwt.verify lancia errore se token non valido/scaduto
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // payload minimo: { id, email }
    req.user = payload;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};
