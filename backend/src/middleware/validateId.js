/**
 * Middleware: valida l'ID numerico presente nei parametri della rotta.
 * Evita query inutili e input non validi.
 */
module.exports = function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id non valido' });
  }
  next();
};
