var fs = require('fs');
var http = require('http');


const cors =require('cors');
const express=require('express');
const bodyParser = require('body-parser');

const utilz = require('./utilz.js');
const mongo =require('./mongo.js');
const bcyrpt = require('bcryptjs');
const saltRounds=10;
const app = express();
	app.use(cors());

http.createServer(app).listen(1300,()=>{
	utilz.logData('Express Server Listening....');


	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	    next();
	});

	app.get('/', (req,res) => {
		res.send('!ntrest.com public access API');
	});

	app.post('/login', async (req,res) => {
		try{
			console.log(req.body.payload);
				let user = await mongo.AuthenticateUser(req.body.payload);
				if(user !== false && user !== null) {
					user['password'] = 'F00';
					let token = await utilz.GenerateJwt(user);
					// console.log(user);
					res.status(200).send({ access_token: token, user, Code: 701 });
				} else {
					res.status(401).send({ Error: ['Failed Authentication'], Code: 601 })
				}
			}catch(err){
				console.log(err);
			}
		
	});

	app.get('/verify',async(req,res)=>{
		let auth = req.header('authorization').split("Bearer ");
		let verified = await utilz.VerifyJwt(auth[1]);
		switch(verified) {
			case true:
				console.log('Valid Token.');
				res.status(200).send({ success_message: ['Valid Jwt'], Code: 702 })
				break;
			case false:
				console.log('Invalid Token.');
				res.status(401).send({ failed_message: ['Invalid Jwt'], Code: 602 })
				break;
			default:
				break;
		}
	});

	app.post('/articles', async(req,res)=>{
		console.log(req.body.payload.col);

		let articles = await mongo.GetPaginatedDocuments(req.body.payload.col,null,{},req.body.payload.sort,req.body.payload.skip,req.body.payload.limit);
		// console.log(articles);
		res.status(200).send({articles,Code:703});
	});

	app.post('/authors',async(req,res )=>{
		let authors = await mongo.GetAuthors(req.body.payload.newAuthors);
		res.status(200).send({ authors, Code : 704});
	});

	app.post('/articles/post/new',async(req,res)=>{
		let result = await mongo.InsertDocument('articles',req.body.payload);
		// console.log(result);
		res.status(200).send({Code: 708});

	});

	app.get('/articles/:oid/like/:uid', async(req,res) => {
		let result = await mongo.UpdateDocument('like-article', req.params.oid, {"$addToSet": { 'likes': { uid: req.params.uid, 'ts': Date.now() }},"$pull":{ 'unlikes': { uid: req.params.uid}}});
		console.log("oid:",req.params.oid,"uid:",req.params.uid,"like",result.result);
		if(result['modifiedCount'] === 1) { res.status(200).send({  Code: 706 }); }
	});

	app.get('/articles/:oid/unlike/:uid', async(req,res) => {
		let result = await mongo.UpdateDocument('unlike-article', req.params.oid, {"$addToSet": { 'unlikes': { uid: req.params.uid, 'ts': Date.now() }},"$pull":{ 'likes': { uid: req.params.uid}}});
		console.log("oid:",req.params.oid,"uid:",req.params.uid,"unlike:",result.result);
		if(result['modifiedCount'] === 1) { res.status(200).send({  Code: 707 }); }
	});

	app.post('/new_user',async(req,res)=>{
		// console.log(req.body.payload);
		// $2a$10$C2Mcot5d0IhMyyahEh8M5uxw/7JI/R48Wvavvsj0EwuXWgEQ6lI7y
		// '$2a$10$glNpyUK49.5EYtdXYRjpaeIjIEs.OBS94Vp9QDzj1UHiRoXTMHuGC'
		// let p = utilz.decodeBase64(upObj['password']);
		// let pass =utilz.GenerateBcryptPassword(req.body.payload.password);
		// console.log('password',pass);
		let password = utilz.decodeBase64(req.body.payload.password);
		console.log(password);
		req.body.payload.password = bcyrpt.hashSync(password,saltRounds);;
		// console.log(req.body.payload.password);
		console.log(req.body.payload);
		let result = await mongo.InsertDocument('users',req.body.payload);
		console.log(result);
		res.status(200).send({Code: 709});

	});

});

