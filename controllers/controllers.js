const request = require('request');
const passport = require('passport');
const  APIkey = require('../config/env');
const Currency = require('../models/currency');
var URL_prefix = 'https://www.currencyconverterapi.com/api/v5/';
function getRoot(req, res){
	let newCurrency = new Currency();
	let currencies = [];
	newCurrency.collection.find().sort( { countryName: 1 }).forEach(function(results){
		currencies.push(results);
	}, function(){
		res.render('landingPage', {currencies:currencies});;
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

//convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=[YOUR_API_KEY]
function getExchangeRate(req, res){
	let fromCurrency = new Currency;
	fromCurrency.collection.find({countryName:req.query.from}, {currencyId:1, _id:0}).toArray(function(err, doc_from){
		let toCurrency = new Currency;
		toCurrency.collection.find({countryName:req.query.to}, {currencyId:1, _id:0}).toArray(function(err, doc_to){
			//console.log(doc_from[0]['currencyId']);
			//console.log(doc_to[0]['currencyId']);
			let URL = URL_prefix + 'convert?q=' + doc_from[0]['currencyId'] + '_' + doc_to[0]['currencyId'] + ',' + doc_to[0]['currencyId'] + '_' + doc_from[0]['currencyId'] + '&compact=ultra&apiKey=' + APIkey;
			request(URL,  function(req,res){
				let exchangeRate = res.body;
				sendResponse(exchangeRate);
			});
		});
	});
	function sendResponse(exchangeRate){
		res.json(exchangeRate);
	};
/*	let query1 = req.query.q.split();
	query1 = query1.reverse();
	query1 = query1.join();
	
	
	*/
};

function getCurrencies(req, res){
	let URL = URL_prefix + 'countries?apiKey=' + APIkey;
	request(URL, function(req, res, body){
		let drop = new Currency();
		drop.collection.remove();
		let currencies = JSON.parse(body);

		let i = 0;
		for(let property in currencies){
			let i = 0;
			for (let nestedProperty in currencies[property]){
				i++;
				console.log(currencies[property][nestedProperty]['currencyName'], i);
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



module.exports.getRoot = getRoot;
module.exports.getExchangeRate = getExchangeRate;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
module.exports.getCurrencies = getCurrencies;