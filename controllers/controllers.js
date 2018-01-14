const request = require('request');
const passport = require('passport');
const  APIkey = require('../config/env');
const currency = require('../models/currency');
var URL_prefix = 'https://www.currencyconverterapi.com/api/v5/';
function getRoot(req, res){
	res.send('Home Page');
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

function getNew(req, res){
	res.json({name:'milad'});
}
//convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=[YOUR_API_KEY]
function getExchangeRate(req, res){
	let query1 = req.query.q.split();
	query1 = query1.reverse();
	query1 = query1.join();
	let URL = URL_prefix + 'convert?q=' + req.query.q + ',' + query1 + '&compact=ultra&apiKey=' + APIkey;
	request(URL,  function(req,res){
		let exchangeRate = res.body;
		sendResponse(exchangeRate);
	});
	function sendResponse(exchangeRate){
		res.json(exchangeRate);
	};
};

function getCurrencies(req, res){
	let URL = URL_prefix + 'currencies?apiKey=' + APIkey;
	request(URL, function(req, res, body){
		let drop = currency;
		drop.collection.remove();
		let currencies = JSON.parse(body);
		let i = 0;
		for(let property in currencies){
			for (let nestedProperty in currencies[property]){
				let newCurrency = currency();
				/*console.log("currency Name: ", currencies[property][nestedProperty]["currencyName"]);
				console.log("currency Symbol: ", currencies[property][nestedProperty]["currencySymbol"]);
				console.log("currency id: ", currencies[property][nestedProperty]["id"]);*/
				newCurrency.currencyName = currencies[property][nestedProperty]["currencyName"];
				newCurrency.currencyId = currencies[property][nestedProperty]["id"];
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
module.exports.getNew = getNew;
module.exports.getExchangeRate = getExchangeRate;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
module.exports.getCurrencies = getCurrencies;