const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');
const validateId = require('../middleware/validateId');

// CRUD Books
router.get('/', bookController.getAllBooks);
router.get('/:id', validateId, bookController.getBookById);

router.get('/:id/citazioni', validateId, bookController.getBookQuotes);
router.get('/:id/recensioni', validateId, bookController.getBookReviews);

router.post('/:id/citazioni', validateId, bookController.createBookQuote);
router.post('/:id/recensioni', validateId, bookController.createBookReview);

router.post('/', validateBook, bookController.createBook);
router.put('/:id', validateId, validateBook, bookController.updateBook);

router.delete('/:id', validateId, bookController.deleteBook);

module.exports = router;
