const os = require('os');
const fs = require('fs');
// const express =require('express');

const jwt = require('jsonwebtoken');
// const config = require('./config.json');

// using bcyrptjs alternative to bcyrpt.
const bcyrpt = require('bcryptjs');
const { v1: uuidv1} = require('uuid');

const saltRounds=10;


//no key and cert is used.

const system_configuration = {
	"system": {
		"databases": {
			"mongo": {
				"url": "mongodb://mongod:SOMEHARDPASSWORD@127.0.0.1:27017?authMechanism=SCRAM-SHA-1&authSource=admin"	
			},
		},
		"security":{
			"jwt_secret": "worldisfullofdevelopers",
			"jwt_claims": {
		        issuer:    		"127.0.0.1",     	// who creates the token and signs it
		        audience:    	"127.0.0.1",  	// to whom the token is intended to be sent
		        expiresIn:   	"30m",             		// time when the token will expire (10 minutes from now)
		        jwtid:    		"",          			// a unique identifier for the token
		        //"iat":    	"", 					// when the token was issued/created (now) , USING DEFAULTS
		        notBefore:    	"0",                 	// time before which the token is not yet valid (0 milisecond agao, for emmediate validation)
		        subject:     	"Development Services", // the subject/principal is whom the token is about		       
				algorithm:  	"HS256"

		},
		"verify_options": {
				issuer:  	"127.0.0.1",
				subject:  	"Development Services",
				audience:  	"127.0.0.1",
				expiresIn:  "30m",
				algorithm:  ["HS256"]				
			}
		}
	}
}

function logData(message) {
	var d = new Date();
	var time =  '[' + d.getHours() + ':' + d.getMinutes() + ':' +d.getSeconds() + '] ';
	
	console.log(time + message)
}

function decodeBase64(data) {
	let buff = Buffer.from(data, 'base64');
	let text = buff.toString('ascii');
	return text	
}

function GenerateBcryptPassword(p){
	let password =bcyrpt.hash(p,saltRounds);
	return password;
}

async function bcryptValidatePassword(p,h) {
	console.log('p:',p,'h:',h);
	return bcyrpt.compareSync(p,h);

}

let secret =system_configuration['system']['security']['jwt_secret'];
async function GenerateJwt(user){
	let claims = system_configuration['system']['security']['jwt_claims'];
	claims['jwtid'] = uuidv1();
	
	
	let scopes = {
		api: 'full_access'
	}
	
	var token =  jwt.sign({user,scopes},secret, claims);
	
	return token;

}

async function VerifyJwt(token) {
	try {
		var legit = jwt.verify(token, secret, system_configuration['system']['security']['verify_options']);
		console.log("\nJWT verification result: " + JSON.stringify(legit));	
		return true; 
	} catch(err) {
		console.log(err)
		return false;
	}
	return false;	
}

module.exports={
	system_configuration,
	logData,
	decodeBase64,
	bcryptValidatePassword,
	GenerateJwt,
	VerifyJwt,
	GenerateBcryptPassword,
}
