var express = require('express');
var router = express.Router();
var path = require('path')
/* Default  GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

router.get('/spotify', function(req, res, next) {
 // res.render('index', { title: 'Express' });
 //change above to send {image: 'uwblock.jp'}
 
  res.sendFile(path.join(__dirname, '../views/spotify.html'))
	
	
});


router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
 //change above to send {image: 'uwblock.jp'}
 
  res.sendFile(path.join(__dirname, '../views/index.html'))
	
	
});



module.exports = router;
