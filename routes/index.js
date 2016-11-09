var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var HighScore = mongoose.model('HighScore');
var User = mongoose.model('User');


var highscores
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() {
	console.log('Connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('test.html', { root: 'public' });
	//res.render('SpaceCadet', { title: 'Express' });
});

router.post('/user', function(req,res,next){
	var newUser=new User(req.body);
	newUser.save(function(err, post){
		if(err) return console.rror(err);
	
	});
	User.find().sort([['score','descending']]).limit(10).exec(function(err, scores){
  		if (err) return console.error(err);
		else{
			console.log(scores);
		}
	});
	User.find(function(err, userList){
		if (err) return console.error(err);
   		else {
    		}
  	});
			
});

router.get('/user', function(req,res,next){
		User.find().sort([['score','descending']]).limit(10).exec(function(err, scores){
  		if (err) return console.error(err);
		else{
			console.log(scores);
			res.json(scores);
		}
	});
});



module.exports = router;
