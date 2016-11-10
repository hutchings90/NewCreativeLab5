var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var HighScore = mongoose.model('HighScore');
var User = mongoose.model('User');


var highscores
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() {
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('SpaceCadet.html', { root: 'public' });
});

router.post('/user', function(req,res,next){
	var user = new User(req.body);
    user.save(function(err, post){
		if(err) return console.error(err);
        res.end();
	});
});

router.get('/user', function(req,res,next){
		User.find().sort([['score','descending']]).limit(10).exec(function(err, scores){
  		if(err) return console.error(err);
		else res.json(scores);
	});
});

module.exports = router;
