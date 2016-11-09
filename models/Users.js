var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	score: Number,
	password: String
});

var highScoreSchema = new mongoose.Schema({
	highScore: [userSchema]
});
mongoose.model('HighScore', highScoreSchema);
mongoose.model('User', userSchema);
