var express = require('express');
var path = require('path');
var router = express.Router();
const db_config = require('./../db_config');

router.get('/', function(req, res, next) {
	const apiUrl = 'http://'+db_config.programIP
	const apiPort = db_config.programPort
    res.render('index.ejs', { apiUrl, apiPort });
});

module.exports = router;