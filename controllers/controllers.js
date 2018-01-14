const request = require('request');
const passport = require('passport');
const  APIkey = require('../config/env');
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

}

module.exports.getRoot = getRoot;
module.exports.getNew = getNew;
module.exports.getExchangeRate = getExchangeRate;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
module.exports.getCurrencies = getCurrencies;