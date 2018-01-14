const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers");


router.get('/', controllers.getRoot);

router.get('/signup', controllers.getSignUp);

router.post('/signup', controllers.postSignUp);

router.get('/new', controllers.getNew);

router.get('/exchangeRate', controllers.getExchangeRate);

router.get('/currencies', controllers.getCurrencies);

module.exports = router;