const mongoose = require('mongoose');
const Currency = require('./currency');
const ExchangeRate = require('./exchangeRate');
const HistoryExchangeRate = require('./historyExchangeRate');
const User = require('./user');

let dbConnection = mongoose.connect(process.env.MONGODB_URI ||
                 process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||'mongodb://localhost/test'); 
// var db = mongoose.connection;
/*console.log(ExchangeRate.collection);*/
//console.log('Connected to the DB');
/*var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: String,
	email: {type: String, required: true},
	password: {type: String, required: true}
});*/

/*let newUser = mongoose.model('User', UserSchema);
console.log(newUser);
newUser.create({
	firstName: 'Milad',
	lastName: 'Abujarada',
	email: 'Milad.Abujarada@gmail.com',
	password: 'HELLO!'
},function(err){
	if(!err){
		console.log('Data was saved successfully.');
	}else{
		console.log("Error: ", err);
	}
});*/

module.exports = {
	Currency,
	ExchangeRate,
	HistoryExchangeRate,
	User
};