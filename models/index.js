const mongoose = require('mongoose');
const Currency = require('./currency');
const ExchangeRate = require('./exchangeRate');
const HistoryExchangeRate = require('./historyExchangeRate');
const User = require('./user');

let dbConnection = mongoose.connect(process.env.MONGODB_URI ||
                 process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||'mongodb://localhost/test'); 
module.exports = {
	Currency,
	ExchangeRate,
	HistoryExchangeRate,
	User
};