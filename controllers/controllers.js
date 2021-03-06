const request_module = require('request');
const  APIkey = process.env.APIkey || require('../config/env');
const index = require('../models/index');
const Currency = index.Currency;
const HistoryExchangeRate = index.HistoryExchangeRate;
const ExchangeRate = index.ExchangeRate;
const passport = require('passport');

//setting up the fixed part of every request to the API
var URL_prefix = 'https://www.currencyconverterapi.com/api/v5/';

//this function just retrieves all the currencies info from the API in order to populate the select tags on the pages 
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

//function to responed with the / page
function getRoot(request, response){
	let currencies = [];
	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			console.log(request.flash.loginMessage);
			response.render('landingPage', {currencies:results,heroku:localhost,loginMessage:request.flash('loginMessage'), logoutMessage:request.flash('logoutMessage')});
		});
};

//function used to send a request to the API in order to retrieve currecy exchange between two currencies
function getExchangeRate(request, response){
	Currency.find({countryName:{ $in: [request.query.from,request.query.to]}}, 
					{currencyId:1, _id:0},
					(error, result) => {
						let URL = URL_prefix + 'convert?q=' + result[0]['currencyId'] + '_' + result[1]['currencyId'] + ',' + result[1]['currencyId'] + '_' + result[0]['currencyId'] + '&compact=ultra&apiKey=' + APIkey;
						request_module(URL, (req,res) => {
							console.log(res.body);
							response.json(res.body)
						});
					}
	)
};

//serving the first page after a user either logs in or logs out
function newExchangeRate(request, response){
	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			response.render('newExchangeRate', {currencies:results, heroku:localhost, message: request.flash('successfulLogin')});
		});
};

//serving the page that allow the user to inquire about the history of exchange between two currencies
function newCurrencyHistory(request, response){
	Currency.find({}, null, {sort:{countryName:1}})
		.then(results => {
			let localhost = checkLocalhostOrHeroku();
			response.render('newCurrencyHistory', {currencies:results,heroku:localhost, saved:request.flash('saved')});
		});
};

//getting the data for the history exchange from the API
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

//saving the user's chosen search results from the histroy exchange between two currencies
let saveHistoryExchange = (request,response) => {
	console.log(request.session);
	HistoryExchangeRate.create({
		date: request.body.date,
		from: request.body.from,
		to: request.body.to,
		fromRates: request.body.fromRates,
		toRates: request.body.toRates,
		historyDates: request.body.historyDates,
		comment: request.body.comment,
		userId: request.session.passport.user
	}, (error,result) => response.send(error));
};

//function to check if the requests are being sent from heroku or local host
//this is to develop once and use anywhere
let checkLocalhostOrHeroku = () => {
	let localhost;
	if (process.env.PORT){
			localhost = false;
		} else {
			localhost = true;
		};
		return localhost;
};

//this function is to show the user's saved seraches for history exchange 
let previousActivity = (request,response) => {
	HistoryExchangeRate.find({'userId': request.session.passport.user}, null, {sort:{date:-1}})
		.then( results => {
			console.log(results); 
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
};

let putCurrencyHistory = (request, response) => {
	HistoryExchangeRate.findByIdAndUpdate(request.params.id, {comment: request.body.newComment}, error => {
		response.send(error);
	})
};

let getSignUp = (request, response) => {
	response.render('signup');
};

function postSignUp(request, response, next){
	let signupStrategy = passport.authenticate('local-signup',{
		successRedirect:'/exchageRate/new',
		failureRedirect:'/signup',
		failureFlash: true,
		successFlash: true
	});

	return signupStrategy(request, response, next);
};

function login(request, response) {
	let loginStrategy = passport.authenticate('local-login',{
		successRedirect:'/exchageRate/new',
		failureRedirect:'/',
		failureFlash: true,
		successFlash: true
	});
	return loginStrategy(request, response);
};

function logout(request, response){
	request.logout();
	response.redirect('/');
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
module.exports.putCurrencyHistory = putCurrencyHistory;
module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;
module.exports.login = login;
module.exports.logout = logout;

