const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers");

function authenticatedUser(req, res, next) {
if (req.isAuthenticated()) return next();
res.redirect('/');
};

router.get('/currenciesInfo', controllers.getCurrenciesInfo);

router.get('/', controllers.getRoot);

router.get('/exchangeRate', controllers.getExchangeRate);

router.get('/exchageRate/new', authenticatedUser, controllers.newExchangeRate);

router.get('/currencyHistory/new', authenticatedUser, controllers.newCurrencyHistory);

router.get('/getCurrencyHistory', authenticatedUser, controllers.getCurrencyHistory);

router.post('/currencyHistory/save', authenticatedUser, controllers.saveHistoryExchange);

router.get('/previousActivity', authenticatedUser, controllers.previousActivity);

router.delete('/currencyHistory/:id', authenticatedUser, controllers.deleteCurrencyHistory);

router.put('/currencyHistory/:id', authenticatedUser, controllers.putCurrencyHistory);

router.get('/signup', controllers.getSignUp);

router.post('/signup', controllers.postSignUp);

router.post('/login', controllers.login);

router.get('/logout', controllers.logout);

module.exports = router;