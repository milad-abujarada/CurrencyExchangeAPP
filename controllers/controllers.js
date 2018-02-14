const request_module = require('request');
const  APIkey = process.env.APIkey || require('../config/env');
const index = require('../models/index');
const Currency = index.Currency;
const HistoryExchangeRate = index.HistoryExchangeRate;
const ExchangeRate = index.ExchangeRate;

/*const passport = require('passport');*/

var URL_prefix = 'https://www.currencyconverterapi.com/api/v5/';

function getCurrenciesInfo(request, response){
	let URL = URL_prefix + 'countries?apiKey=' + APIkey;
	request_module(URL, function(req, res, body){
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
		response.json(message);
	};
};

function getRoot(request, response){
	let currencies = [];
	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			response.render('landingPage', {currencies:results,heroku:localhost});
		});
};

function getExchangeRate(request, response){
	Currency.find({countryName:{ $in: [request.query.from,request.query.to]}}, 
					{currencyId:1, _id:0},
					(error, result) => {
						console.log(">>>>>>>",result);
						let URL = URL_prefix + 'convert?q=' + result[0]['currencyId'] + '_' + result[1]['currencyId'] + ',' + result[1]['currencyId'] + '_' + result[0]['currencyId'] + '&compact=ultra&apiKey=' + APIkey;
						request_module(URL, (req,res) => {
							console.log(res.body);
							response.json(res.body)
						});
					}
	)
};

function newExchangeRate(request, response){
	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			response.render('newExchangeRate', {currencies:results, heroku:localhost});
		});
};

function newCurrencyHistory(request, response){

	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			response.render('newCurrencyHistory', {currencies:results,heroku:localhost});
		});
};

function getCurrencyHistory(request, response){
	Currency.find({countryName:{$in:[request.query.from, request.query.to]}},
					{currencyId:1, _id:0},
					(error, result) => {
						let URL = URL_prefix + 'convert?q=' + result[0]['currencyId'] + '_' + result[1]['currencyId'] + ',' + result[1]['currencyId'] + '_' + result[0]['currencyId'] + '&compact=ultra&' + 'date=' + request.query.fromDate + '&endDate=' + request.query.toDate + '&apiKey=' + APIkey; 
						
						request_module(URL, (req,res) => {
							response.json(res.body)
						});					
					}
	);
};

let saveHistoryExchange = (request,response) => {
	console.log(request.body);
	HistoryExchangeRate.create({
		date: request.body.date,
		from: request.body.from,
		to: request.body.to,
		fromRates: request.body.fromRates,
		toRates: request.body.toRates,
		historyDates: request.body.historyDates,
		comment: request.body.comment
	}, (error,result) => response.send(error));
};

let checkLocalhostOrHeroku = () => {
	let localhost;
	if (process.env.PORT){
			localhost = false;
		} else {
			localhost = true;
		};
		return localhost;
};

let previousActivity = (request,response) => {
	HistoryExchangeRate.find({}, null, {sort:{date:-1}})
		.then( results => {
			console.log(results/*[0].from*/); 
			let localhost = checkLocalhostOrHeroku();
			if (results.length){
				response.render('previousActivity', {data:results,heroku:localhost});
			} else {
				response.render('noResults');
			}
			
		});
};

let deleteCurrencyHistory = (request, response) => {
	HistoryExchangeRate.findByIdAndRemove(request.params.id, error => {
		response.send(error);
	});
}
/*function postExchangeRate(request, response){
	let exchangeRate = new ExchangeRate();
	exchangeRate.date = Date();
	exchangeRate.from = request.body.from;
	exchangeRate.to = request.body.to;
	exchangeRate.fromRate = request.body.fromRate;
	exchangeRate.toRate = request.body.toRate;
	exchangeRate.comments = request.body.comments;
	exchangeRate.save();
};*/




function getSignUp(req, response){
	response.render('signup');
}

function postSignUp(req, response, next){
	let signupStrategy = passport.authenticate('local-signup',{
		successRedirect:'/',
		failureRedirect:'/signup',
		failureFlash: true
	});

	return signupStrategy(request, ressponse, next);
}


module.exports.getCurrenciesInfo = getCurrenciesInfo;
module.exports.getRoot = getRoot;
module.exports.getExchangeRate = getExchangeRate;
module.exports.newExchangeRate = newExchangeRate;
module.exports.newCurrencyHistory = newCurrencyHistory;
module.exports.saveHistoryExchange = saveHistoryExchange;
module.exports.getCurrencyHistory = getCurrencyHistory;
module.exports.previousActivity = previousActivity;
module.exports.deleteCurrencyHistory = deleteCurrencyHistory;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
