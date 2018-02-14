const mongoose = require('mongoose');

let historyExchangeRate = new mongoose.Schema({
	date: {type: Date, required: true},
	from: {type:String, required: true},
	to: {type: String, required: true},
	fromRates: {type:Array, required: true},
	toRates: {type: Array, required: true},
	historyDates: {type:Array, requied: true},
	comment: String
});
let HistoryExchangeRate = mongoose.model('HistoryExchangeRate', historyExchangeRate);

module.exports = HistoryExchangeRate;