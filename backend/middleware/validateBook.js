const ALLOWED_STATI = ['da leggere', 'in lettura', 'letto'];

module.exports = function validateBook(req, res, next) {
  const { titolo, autore, stato, utente_id } = req.body;

  // titolo
  if (typeof titolo !== 'string' || titolo.trim().length === 0) {
    return res.status(400).json({ error: 'titolo è obbligatorio e deve essere una stringa' });
  }

  // autore
  if (typeof autore !== 'string' || autore.trim().length === 0) {
    return res.status(400).json({ error: 'autore è obbligatorio e deve essere una stringa' });
  }

  // utente_id (nel tuo DB è INT + FK)
  const uid = Number(utente_id);
  if (!Number.isInteger(uid) || uid <= 0) {
    return res.status(400).json({ error: 'utente_id è obbligatorio e deve essere un intero positivo' });
  }

  // stato (opzionale, ma se c'è deve essere valido)
  if (stato !== undefined && stato !== null && stato !== '') {
    if (!ALLOWED_STATI.includes(stato)) {
      return res.status(400).json({
        error: `stato non valido. Valori ammessi: ${ALLOWED_STATI.join(', ')}`
      });
    }
  }

  // Normalizziamo i campi “puliti” (utile per controller/model)
  req.body.titolo = titolo.trim();
  req.body.autore = autore.trim();
  req.body.utente_id = uid;

  next();
};
