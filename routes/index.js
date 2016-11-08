var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('SpaceCadet.html', { root: 'public' });
	//res.render('SpaceCadet', { title: 'Express' });
});

module.exports = router;
