/* eslint-disable no-unused-vars */
const express = require('express');
const BookServices = require('./books.service');
const router = express.Router();
const { authenticateJWT } = require('../../infrastructures/middlewares/authenticate.middleware');
const { validate } = require('../../infrastructures/utils/validation');
const SaveBookValidation = require('./validators/book.validator');

const bookservice = new BookServices();

router.get('/', authenticateJWT, bookservice.getBookList);
router.get('/:id', authenticateJWT, bookservice.getBookById);
// router.post('/', authenticateJWT, SaveBookValidation(), validate(), bookservcice.saveBook);
router.post('/', authenticateJWT, SaveBookValidation(), validate, bookservice.saveBook);
router.get('/search', authenticateJWT, bookservice.searchBook);
router.post('/update', authenticateJWT, SaveBookValidation(), validate, bookservice.updateBook);
router.get('/delete/:id', authenticateJWT, bookservice.deleteBook);

module.exports = router;
