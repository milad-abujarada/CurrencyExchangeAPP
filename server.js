const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const router = require(__dirname + '/config/routes');

var PORT = process.env.PORT || 3000;

//initializing the passport strategies
require('./config/passport')(passport); 

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//setting up the session for the user and using a session cookie name 'thisSession_id'
//which is gonna be set at the user's browser
app.use(session({
	key: 'thisSession_id',
	secret: 'Hello'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//printing Hit everytime a request is recieved
app.use(function(req,res,next){
	console.log('Hit');
	next();
});
app.use(express.static(__dirname +'/public'));
app.use('/',router);

app.listen(PORT);