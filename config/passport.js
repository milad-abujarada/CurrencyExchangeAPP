let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, callback){
		callback(null, user.id);
	});

	passport.deserializeUser(function(id, callback){
		User.findById(id, function(err, user){
			callback(err, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done){
		User.findOne({'email': email}, function(err, user){
			if(err) return done(err);

			if(!user) return done(null, false, req.flash('loginMessage', 'No user with these credintials was found.'));

			if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));

			return done(null, user, req.flash('successfulLogin', 'Welcome '+user.email)); 
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, callback){
		User.findOne({'email': email}, function(err, user){
			//there was an error
			if(err) return callback(err);

			//there is a user with this email
			if(user){
				console.log('Found user');
				return callback(null, false, req.flash('signupMessage', 'Email in use'));
				//you are new
			} else{
				let newUser = new User();
				newUser.email = email;
				newUser.password = newUser.encrypt(password);
				newUser.save(function(err){
					if(err) return callback(err);
					return callback(null, newUser);
				});
			}
		});
	}));
};