const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/currencyExchange'); 
var db = mongoose.connection;
//console.log(db);
//console.log('Connected to the DB');
var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: String,
	email: {type: String, required: true},
	password: {type: String, required: true}
});

let newUser = mongoose.model('User', UserSchema);
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
});