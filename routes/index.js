var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '파피온라인 1대1 전적검색' });
});

module.exports = router;
