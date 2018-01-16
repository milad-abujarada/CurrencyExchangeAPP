const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get('/currencies', controllers.getCurrencies);

router.get('/exchangeRate', controllers.getExchangeRate);

router.get('/history', controllers.history);

router.get('/getCurrencyHistory', controllers.getCurrencyHistory);

router.get('/', controllers.getRoot);

router.get('/signup', controllers.getSignUp);

router.post('/signup', controllers.postSignUp);






module.exports = router;