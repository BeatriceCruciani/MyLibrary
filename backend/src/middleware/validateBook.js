/**
 * Middleware di validazione/normalizzazione dati libro.
 * - Verifica titolo/autore
 * - Verifica stato (se presente)
 * - Normalizza gli input (trim) e imposta un default per stato
 * - Imposta SEMPRE utente_id dal token (sicurezza: non lo accettiamo dal client)
 */
const ALLOWED_STATI = ['da leggere', 'in lettura', 'letto'];

module.exports = function validateBook(req, res, next) {
  const { titolo, autore, stato } = req.body;

  // utente_id DEVE arrivare dal token (middleware auth)
  if (!req.user || !Number.isInteger(req.user.id) || req.user.id <= 0) {
    return res.status(401).json({ error: 'Utente non autenticato' });
  }

  // titolo obbligatorio
  if (typeof titolo !== 'string' || titolo.trim().length === 0) {
    return res.status(400).json({
      error: 'titolo è obbligatorio e deve essere una stringa non vuota'
    });
  }

  // autore obbligatorio
  if (typeof autore !== 'string' || autore.trim().length === 0) {
    return res.status(400).json({
      error: 'autore è obbligatorio e deve essere una stringa non vuota'
    });
  }

  // stato (opzionale, ma se presente deve essere valido)
  if (stato !== undefined && stato !== null && stato !== '') {
    if (!ALLOWED_STATI.includes(stato)) {
      return res.status(400).json({
        error: `stato non valido. Valori ammessi: ${ALLOWED_STATI.join(', ')}`
      });
    }
  }

  // Normalizzazione campi (evita spazi iniziali/finali e valori vuoti)
  req.body.titolo = titolo.trim();
  req.body.autore = autore.trim();
  req.body.stato = stato ? stato : 'da leggere';

  // Sicurezza: il proprietario del libro è l'utente del token, non il client
  req.body.utente_id = req.user.id;

  next();
};
