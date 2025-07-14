const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
    .post(protect, transactionController.createTransaction)
    .get(protect, transactionController.getTransactions);

router.route('/:id')
    .get(protect, transactionController.getTransaction);

module.exports = router;