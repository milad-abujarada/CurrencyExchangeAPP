const expect = require('chai').expect;
const request = require('request');
const User = require('../models/user');


describe("XCHANGE IT!", function(){
	let requestResponse, URL='http://localhost:3000/';
	let user = new User();
	before(function(done){
		request(URL, function(error, response){
			requestResponse = response;
			done();
		});
		user.email = 'milad.abujarada@gmail.com';
		user.password = 'password';
	})
	it("Response should return 200-OK", function(){
		expect(requestResponse.statusCode).to.eq(200);
	});
	it("Response should have a cookie with key thisSession_id", function(){
		expect(requestResponse.headers['set-cookie'][0]).to.include('thisSession_id');
	});
	it("Response body should not be empty", function(){
		expect(requestResponse.body).to.not.empty;
	});
	it("User should have an email", function(){
		expect(user.email).to.eq('milad.abujarada@gmail.com');
	});
	it("User should have a password", function(){
		expect(user.password).to.eq('password');
	});
});