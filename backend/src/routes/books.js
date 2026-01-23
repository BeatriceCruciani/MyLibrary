const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');
const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth.middleware');

// ROTTE SPECIFICHE PRIMA

// Libri dell'utente loggato (protetta)
router.get('/me/mine', auth, bookController.getMyBooks);

// Statistiche libri dell'utente loggato (protetta)
router.get('/me/stats', auth, bookController.getMyStats);

// ROTTE PUBBLICHE (lettura)
router.get('/', bookController.getAllBooks);
router.get('/:id', validateId, bookController.getBookById);

router.get('/:id/citazioni', validateId, bookController.getBookQuotes);
router.get('/:id/recensioni', validateId, bookController.getBookReviews);

// ROTTE PROTETTE (scrittura/modifica)
router.post('/', auth, validateBook, bookController.createBook);
router.put('/:id', auth, validateId, validateBook, bookController.updateBook);
router.delete('/:id', auth, validateId, bookController.deleteBook);

router.post('/:id/citazioni', auth, validateId, bookController.createBookQuote);
router.post('/:id/recensioni', auth, validateId, bookController.createBookReview);

router.delete('/:id/citazioni/:quoteId', auth, validateId, bookController.deleteBookQuote);
router.delete('/:id/recensioni/:reviewId', auth, validateId, bookController.deleteBookReview);

module.exports = router;
