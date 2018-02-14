const mongoose = require('mongoose');

let exchangeRate = new mongoose.Schema({
	date: {type: Date, required: true},
	from:{type: String, required: true},
	to: {type: String, required: true},
	fromRate:{type: Number, required: true},
	toRate:{type: Number, required: true},
	comments: String
});
let ExchangeRate = mongoose.model('ExchangeRateHistory', exchangeRate);

module.exports = ExchangeRate;