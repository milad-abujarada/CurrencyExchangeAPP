const request = require('request');
const passport = require('passport');
const  APIkey = process.env.APIkey || require('../config/env');
const Currency = require('../models/currency');
var URL_prefix = 'https://www.currencyconverterapi.com/api/v5/';

function getCurrencies(req, res){
	let URL = URL_prefix + 'countries?apiKey=' + APIkey;
	request(URL, function(req, res, body){
		let drop = new Currency();
		drop.collection.remove();
		let currencies = JSON.parse(body);
		for(let property in currencies){
			for (let nestedProperty in currencies[property]){
				let newCurrency = new Currency();
				newCurrency.countryName = currencies[property][nestedProperty]["name"];
				newCurrency.currencyName = currencies[property][nestedProperty]["currencyName"];
				newCurrency.currencyId = currencies[property][nestedProperty]["currencyId"];
				if(currencies[property][nestedProperty]["currencySymbol"]){
					newCurrency.currencySymbol = currencies[property][nestedProperty]["currencySymbol"];
				};
				newCurrency.save();
			};		
		};
		sendResponse("currencies were retreived successfully!");
	});
	function sendResponse(message){
		res.json(message);
	};
};


function getExchangeRate(req, response){
	let fromCurrency = new Currency;
	fromCurrency.collection.find({countryName:req.query.from}, {currencyId:1, _id:0}).toArray(function(err, doc_from){
		let toCurrency = new Currency;
		toCurrency.collection.find({countryName:req.query.to}, {currencyId:1, _id:0}).toArray(function(err, doc_to){
			let URL = URL_prefix + 'convert?q=' + doc_from[0]['currencyId'] + '_' + doc_to[0]['currencyId'] + ',' + doc_to[0]['currencyId'] + '_' + doc_from[0]['currencyId'] + '&compact=ultra&apiKey=' + APIkey;
			request(URL,  function(req,res){
				response.json(res.body)
			});
		});
	});
};


function history(req, res){
	let newCurrency = new Currency();
	newCurrency.collection.find().sort( { countryName: 1 }).toArray(function(err, currencies){
		//console.log(currencies[0]['countryName'] + ' / ' + currencies[0]['currencyName'] + ' / ' + currencies[0]['currencySymbol']);
		res.render('currencyHistory', {currencies:currencies});
	});
};

https://www.currencyconverterapi.com/api/v5/convert?q=USD_EUR&compact=ultra&date=2017-05-01&endDate=2018-01-15&apiKey=1494928f-1674-4161-a596-f9fae74473f0
function getCurrencyHistory(req, response){
	let fromCurrency = new Currency;
	fromCurrency.collection.find({countryName:req.query.from}, {currencyId:1, _id:0}).toArray(function(err, doc_from){
		let toCurrency = new Currency;
		toCurrency.collection.find({countryName:req.query.to}, {currencyId:1, _id:0}).toArray(function(err, doc_to){
			let URL = URL_prefix + 'convert?q=' + doc_from[0]['currencyId'] + '_' + doc_to[0]['currencyId'] + ',' + doc_to[0]['currencyId'] + '_' + doc_from[0]['currencyId'] + '&compact=ultra&' + 'date=' + req.query.fromDate + '&endDate=' + req.query.toDate + '&apiKey=' + APIkey;
			request(URL,  function(req,res){
				response.json(res.body)
			});
		});
	});
};


function getRoot(req, res){
	let newCurrency = new Currency();
	let currencies = [];
	newCurrency.collection.find().sort( { countryName: 1 }).forEach(function(results){
		currencies.push(results);
	}, function(){
		res.render('landingPage', {currencies:currencies});
	});
};


function getSignUp(req, res){
	res.render('signup');
}

function postSignUp(req, res, next){
	let signupStrategy = passport.authenticate('local-signup',{
		successRedirect:'/',
		failureRedirect:'/signup',
		failureFlash: true
	});

	return signupStrategy(req, res, next);
}


module.exports.getCurrencies = getCurrencies;
module.exports.getExchangeRate = getExchangeRate;
module.exports.history = history;
module.exports.getCurrencyHistory = getCurrencyHistory;
module.exports.getRoot = getRoot;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
