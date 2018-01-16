const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const passport = require('passport');

const session = require('express-session');

const flash = require('connect-flash');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ||
                 process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||'mongodb://localhost/test');

const router = require(__dirname + '/config/routes');

var PORT = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(session({secret: 'Hey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use(function(req,res,next){
	console.log('Hit');
	next();
});

app.use(express.static(__dirname +'/public'));

app.use('/',router);

app.listen(PORT);