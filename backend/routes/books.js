// routes/books.js
const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');
const validateId = require('../middleware/validateId');

// CRUD Books
router.get('/', bookController.getAllBooks);
router.get('/:id', validateId, bookController.getBookById);

router.post('/', validateBook, bookController.createBook);
router.put('/:id', validateId, validateBook, bookController.updateBook);

router.delete('/:id', validateId, bookController.deleteBook);

module.exports = router;
