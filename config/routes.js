const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get('/currenciesInfo', controllers.getCurrenciesInfo);

router.get('/', controllers.getRoot);

router.get('/exchangeRate', controllers.getExchangeRate);

router.get('/exchageRate/new', controllers.newExchangeRate);

router.get('/currencyHistory/new', controllers.newCurrencyHistory);

router.get('/getCurrencyHistory', controllers.getCurrencyHistory);

router.post('/currencyHistory/save', controllers.saveHistoryExchange);

router.get('/previousActivity', controllers.previousActivity);

router.delete('/currencyHistory/:id', controllers.deleteCurrencyHistory);

router.get('/signup', controllers.getSignUp);

router.post('/signup', controllers.postSignUp);






module.exports = router;