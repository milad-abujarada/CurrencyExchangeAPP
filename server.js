const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const router = require(__dirname + '/config/routes');

var PORT = process.env.PORT || 3000;

require('./config/passport')(passport); 

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	key: 'thisSession_id',
	secret: 'Hello'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
	console.log('Hit');
	next();
});
app.use(express.static(__dirname +'/public'));
app.use('/',router);

app.listen(PORT);