const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get('/currenciesInfo', controllers.getCurrenciesInfo);

router.get('/exchageRate/new', controllers.newExchangeRate);

router.get('/exchangeRate', controllers.getExchangeRate);

router.get('/currencyHistory/new', controllers.newCurrencyHistory);

router.get('/getCurrencyHistory', controllers.getCurrencyHistory);

router.get('/', controllers.getRoot);

router.get('/signup', controllers.getSignUp);

router.post('/signup', controllers.postSignUp);






module.exports = router;