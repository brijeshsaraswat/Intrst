const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

const utilz =require('./utilz.js');


MongoClient.connect(utilz.system_configuration['system']['databases']['mongo']['url'], { useUnifiedTopology: true, useNewUrlParser: true }, ConfigureAPI);


let api=null;
let admin =null;

function ConfigureAPI(err,db){
	if(!err){
		api=db.db('api');

		utilz.logData("Mongo Connected & Configured");
	}else if(err) {utilz.logData("Mongo not Connected");console.log(err);return;}
}


async function AuthenticateUser(upObj){
	let col =api.collection('users');
	let u = utilz.decodeBase64(upObj['user']);
	let p = utilz.decodeBase64(upObj['password']);

	let find ={
				$or:[
				{email:u},
				{username:u}
				]
	}

	try{
		let user = await col.findOne(find);
		if(user !==null){
			let vp= await utilz.bcryptValidatePassword(p,user['password']);
			switch(vp){
				case true:
					return user;
					break;
				case false:
				default:
					return false;
			}
		}else{
			console.log('Error:@Mongo,User Not Found.');
			return false;
		}

		}catch(error) {
			console.log('Error: @Mongo,Something went Wrong.....',error);
			return false;
		}
}




async function InsertDocument(collection,payload){
	let result = await api.collection(collection).insertOne(payload);
	
	return result;
}
 
async function GetPaginatedDocuments(collection,project,match,sort,skip,limit){
	let count = await api.collection(collection).find(match).count();
	let aggArray =[
				{'$match':match},
				{'$sort':sort},
				{'$skip':parseInt(skip)},
				{'$limit':parseInt(limit)},
	];

	(project != null) ? aggArray.push(project):'';

	let cursor =await api.collection(collection).aggregate(aggArray);
	let docs = [];
	while(await cursor.hasNext()){
		const doc =await cursor.next();
		docs.push(doc);
	}

	docs ={
		count: parseInt(count),
		[`${collection}`]:docs
	}

	return docs;
}

async function GetAuthors(authors) {
	console.log(authors);
	authors = authors.map(function(item){
		return ObjectId(item);
	});

	let cursor =await api.collection('users').find({"_id":{'$in':authors}});
	let docs=[];
	while(await cursor.hasNext()){
		const doc = await cursor.next();
		delete doc.password;
		docs.push(doc);
	}
	return docs;

}

async function UpdateDocument(type, oid, d) {
	switch(type) {
		case 'like-article':
			console.log("like"); 
			return await api.collection('articles').updateOne({'_id': ObjectId(oid)}, d);;
			break;
		case 'unlike-article':
			console.log("unlike");
			return await api.collection('articles').updateOne({'_id': ObjectId(oid)}, d);
			
			break;
		default:
			break;
	}
}


module.exports={
	AuthenticateUser,
	InsertDocument,
	GetPaginatedDocuments,
	GetAuthors,
	UpdateDocument,
}
