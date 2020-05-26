var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
  // path.join(__dirname, 'public')
    var dir = path.join(__dirname, 'public')
        dir = dir.replace('\\routes', "")
        dir = dir+'\\build\\index.html'
    res.sendFile(dir);
});

module.exports = router;