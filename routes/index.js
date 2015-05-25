var express = require('express'); 
var router = express.Router();
var path = require('path')
var fs = require('fs')
var multer = require('multer')
var pg = require('pg');


router.get('/spotify', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/spotify_playlist.html'))
});



var uploadDestination = 'uploads/'
router.use(multer({dest: './' + uploadDestination,
               onFileUploadStart: function(file) {
                  console.log(file.originalname + ' is starting...')
               },
               onFileUploadComplete: function(file) {
                  console.log(file.fieldname + 'upload to ' + file.path)
               }, 
					rename: function(fieldname, filename) {
						return filename; // + Date.now(); would be good to add to avoid dup filenames in the future
					}
}))


router.get('/', function(req, res) {
  res.redirect('/home.html')
});

router.get('/puzzle.html', function(req, res){
  res.sendFile(path.join(__dirname, '../views/index.html'))
})



var getClient = function() {
	var connectionString = process.env.DATABASE_URL
	if(connectionString) {
		//heroku connection
		return new pg.Client(connectionString)
	}	 


	//var host = require('../postgres.js').host
	
	//localhost
	return new pg.Client({
									database: 'memorable',
									//the host is going to be diff for cindy so we'll need to figure that out.
									//https://github.com/brianc/node-postgres/issues/613
									//fedora = uncomment out next line
									//host: '/var/run/postgresql',
									port: 5432});
}



var query = function(query, data, callback) {
	var client = getClient()
	client.connect()
	client.query(query, data, callback)
}





router.get('/image.html', function(req,res) {
  res.sendFile(path.join(__dirname, '../views/image.html'))
})

var insertImage = function(fileName, userID, caption, binaryImgData, callback) {
	var client = getClient()
	client.connect()
   client.query('insert into image values ($1, $2, $3, $4)', [fileName, 'jappleseed', caption, binaryImgData], function(err, writeResult) { 
		//our man in the middle 
		//do ...
		callback(err, writeResult);
	 })
}

//callback are getting fun :)
var getImage = function(fileName, callback) {
	var client = getClient()
	client.connect()
   client.query('select img from image where file_name = $1', [fileName], function(err, readResult) { 
		//our man in the middle 
		//do ...
		callback(err, readResult);
	 })
}



//done
router.post('/upload/:file_name/:caption', function(req, res) {
	//file is being uploaded in form in image.html
	//req.files['files[]'].name
	var userID = 'fake'
	var caption = req.params.caption
	var fileName = req.params.file_name
	var filePath = '../' + uploadDestination + fileName
	filePath = path.join(__dirname, filePath)
	

	//put file in db
	fs.readFile(filePath, 'hex', function(err, imgData) {
		  if (err) { console.log(err)}
        imgData = '\\x' + imgData;

		  var callback = function(err, writeResult) {
				 	if (err) {
          			console.log('err',err,'pg writeResult',writeResult);
					} else {
						//after query ends, retrieve file from db
						var callback = function(err, readResults) {
								  console.log('err',err,'pg readResult',readResults);
								  var img = fs.readFileSync(filePath)
								  var img = readResults.rows[0].img
								  res.contentType = 'image/jpg'
								  res.end(img, 'binary')	

						} 
						getImage(fileName, callback)
					}
		  }
		  insertImage(fileName, userID, caption, imgData, callback)
	})
})



router.get('/upload/:file_name', function(req, res) {
	 //var img = fs.readFileSync(path.join(__dirname, '../uploads/' + req.params.file_name))
	var callback = function(err, readResults) { 
		if (readResults.rows.length > 0) {
			var img = readResults.rows[0].img	
			//convert to base64 before sending so clientside can render the image
			//var base64Img = new Buffer(img, 'hex').toString('base64')
			res.contentType = 'image'
			res.end(img, 'binary')
		} else {
			res.end("Sorry that picture doesn't exist")
		}
	}
	 getImage(req.params.file_name, callback)
});

//done
router.get('/caption/:file_name', function(req, res){
	//return the caption associated with a given photo file_name
	var file_name = req.params.file_name
	var q = "select caption from image where file_name = $1;"
	var data = [file_name]
	var callback = function(err, data) {
		var send = "congrats on finishing the puzzle!!!"
		if (data.rows.length > 0)
			send = data.rows[0].caption		
		res.end(send.toString())			
	}
	query(q, data, callback)	
})







router.get('/profile', function(req, res) {
	res.sendFile(path.join(__dirname, "../MemorableFrontEnd/f_profile.html"))
})

//not done
//update a puzzle difficulty from the user profile page
router.put('/puzzle_difficulty', function(req, res) {
	//will need to pass in user id, and puzzle difficulty
	var user_id = req.body.user_id
	var puzzle_difficulty = req.body.puzzle_difficulty
	var q = "update resident_user set puzzle_level=$1 where user_id=$2"
	var data = [puzzle_difficulty, user_id]
	var callback = function(err, data) {console.log(err) }
	query(q, data, callback)	
	res.end()
})

router.post('/tracks/:song_id/:user_id', function(req, res) {
	var song_id = req.params.song_id;
	//var user_id = req.params.user_id;
	var user_id = 'jappleseed';
	var q = 'insert into song values ($1, $2)';
	var data = [song_id, user_id];
	var callback = function(err, data) { 
		console.log(err);
		res.end();
	}
	query(q, data, callback);
})

router.get('/tracks/:user_id', function(req, res) {
	//saloni- to get this to work do the following.
	//sudo -i -u postgres
	//psql
	//then enter the command 'create database memorable' (if we already created this for you than you're going to need to delete that database because I changed the sql script. do delete the already existing memorable db 'drop database memorable;' before creating it again.
	//then \q. (also, you can exit from your sudo bash shell to just the normal shell)
	// then run 'psql -f memorable_database_create.sql memorable'
	// lastly, hit localhost:3000/tracks/jappleseed in your browser and you should
	// see the word fake_id_1 displayed to the page
	//var user_id = req.params.user_id;
	var user_id = 'jappleseed';
	console.log("died here")
	var q = 'select id from song where user_id=$1';
	var data = [user_id];
	var callback = function(err, data) { 
		console.log(err);
		var song_ids = []
		for (var i = 0; i < data.rows.length; i++) {
			song_ids.push(data.rows[i].id)
		}
		res.json({songIds:song_ids});
	}
	query(q, data, callback);
})


var uploadFolderPath = function(fileName) {
	var filePath = '../' + uploadDestination + fileName
	filePath = path.join(__dirname, filePath)
	return filePath
}

router.get('/play/:fileName', function(req, res) {
	//first rewrite file under the uploads/ folder ie hacky
	//	this is so we dont have to send binary image
	var fileName = req.params.fileName
	var filePath = '../' + uploadDestination + fileName
	filePath = path.join(__dirname, filePath)
	var img = fs.readFileSync(filePath)
	fs.writeFileSync('uploads/picture.jpg', fs.readFileSync('uploads/' + fileName))		

	//explanation of hackiness between this and /uploads/:filename
	// when you click on a puzzle, you get sent to /play/puzzlename
	// then this route copies the puzzlename image into uploads/picture.jpg
	// so that the image src in r_play can call uploads/picture.jpg
	// (a way around part ofthis would be to apend and image with that src before snappuzzle_
  res.sendFile(path.join(__dirname, '../MemorableFrontEnd/r_play.html'))
})


router.get('/uploads/:fileName', function(req, res) {
	var fileName = req.params.fileName

  res.sendFile(path.join(__dirname, '../uploads/'+fileName))
})


//get a list of pictures that belong to a user
//	returns a list of file names of pictures instead of the actual file
router.get('/pictures/:userID', function(req, res) {
	var userID = req.params.userID
	var userID = 'jappleseed' //fix this when changing multi user
	//get picture names from db
	//HARD CODING VALUES instead of talking to db
	var pictures = ['family1.jpg', 'family4.jpg', 'farm2.jpg', 'piano.jpg', 'farm1.jpg', 'family2.jpg', 'family3.jpg']
	res.json({files : pictures})

})


router.get('/selectInterests/:user_id', function(req, res) {
	var user_id = 'gracejohnson';
	// var q = 'select p.file_name from interest_pictures p, interests i where i.interest_type = p.interest_type and i.interest_type in (select interest_type from user_interests where user_id=$1)';
	var q = 'select interest_type from user_interests where user_id=$1';

	var data = [user_id];
	var callback = function(err, data) { 
		console.log(err);
		var interestType = []
		for (var i = 0; i < data.rows.length; i++) {
			interestType.push(data.rows[i].interest_type)
		}
		res.send(interestType);
	}
	query(q, data, callback);
})


router.post('/removeInterest/:user_id/:interest', function(req, res) {
	var user_id = 'gracejohnson';
	var interest = req.params.interest;
	var q = 'delete from user_interests where user_id=$1 and interest_type=$2';
	var data = [user_id, interest];
	var callback = function(err, data) { 
		console.log(err);
		res.end();
	}
	query(q, data, callback);
})


router.post('/addInterest/:user_id/:interest', function(req, res) {
	var user_id = 'gracejohnson';
	var interest = req.params.interest;
	var q = 'insert into user_interests values ($1, $2)';
	var data = [user_id, interest];
	var callback = function(err, data) { 
		console.log(err);
		res.end();
	}
	query(q, data, callback);
})


router.get('/selectGenres/:user_id', function(req, res) {
	var user_id = 'gracejohnson';
	// var q = 'select p.file_name from interest_pictures p, interests i where i.interest_type = p.interest_type and i.interest_type in (select interest_type from user_interests where user_id=$1)';
	var q = 'select genre_type from user_genres where user_id=$1';

	var data = [user_id];
	var callback = function(err, data) { 
		console.log(err);
		var genreType = []
		for (var i = 0; i < data.rows.length; i++) {
			genreType.push(data.rows[i].genre_type)
		}
		res.send(genreType);
	}
	query(q, data, callback);
})


router.post('/removeGenre/:user_id/:genre', function(req, res) {
	var user_id = 'gracejohnson';
	var genre = req.params.genre;
	var q = 'delete from user_genres where user_id=$1 and genre_type=$2';
	var data = [user_id, genre];
	var callback = function(err, data) { 
		console.log(err);
		res.end();
	}
	query(q, data, callback);
})


router.post('/addGenre/:user_id/:genre', function(req, res) {
	var user_id = 'gracejohnson';
	var genre = req.params.genre;
	var q = 'insert into user_genres values ($1, $2)';
	var data = [user_id, genre];
	var callback = function(err, data) { 
		console.log(err);
		res.end();
	}
	query(q, data, callback);
})



module.exports = router;

