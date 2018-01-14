const mongoose = require('mongoose');

let currencySchema = new mongoose.Schema({
	currencyName: {type: String, required: true},
	currencySymbol: String,
	currencyId:{type: String, required: true}
});

let Currency = mongoose.model('CurrencyInfo', currencySchema);

module.exports = Currency;