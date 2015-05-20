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


router.get('/', function(req, res, next) {
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
	//localhost
	return new pg.Client({
									database: 'memorable',
									//the host is going to be diff for cindy so we'll need to figure that out.
									//https://github.com/brianc/node-postgres/issues/613
									//host: '/var/run/postgresql',
									port: 5432});
}



var query = function(query, data, callback) {
	var client = getClient()
	client.connect()
	client.query(query, data, callback)
}


//first demo==remove all of this
router.get('/database', function(req, res) {
	var results = [];

	// Get a Postgres client from the connection pool
	/*
	pg.connect(connectionString, function(err, client, done) {

		  // SQL Query > Select Data
		  var query = client.query("SELECT * FROM admin");
		  // Stream results back one row at a time
		  query.on('row', function(row) {
		  	results.push(row);
		  });
		  // After all data is returned, close connection and return results
		  query.on('end', function() {
		 	 client.end();
		 	 return res.json(results);
		  });

		  // Handle Errors
		  if(err) {
		 	 console.log(err);
		  }
	});
	*/
	var client = new pg.Client({user: 'reggiej7',
									database: 'reggiej7',
									host: '/var/run/postgresql',
									port: 5432});

	client.connect()
	var query = client.query({text: 'SELECT * FROM admin'});
	console.log(query)
	query.on('row', function(row) {
		console.log("zzzzzzzzzzzzz")
		res.render('index', { title: JSON.stringify(row) });
	});
	query
	client.end()
});





router.get('/image.html', function(req,res) {
console.log("inside")
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
			console.log('iinside')
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
	console.log("no")	
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
	var user_id = req.params.user_id;
	var q = 'insert into song values ($1, $2)';
	var data = [song_id, 'jappleseed'];
	var callback = function(err, data) { console.log(err) }
	var data = [song_id, user_id];
	var callback = function(err, data) { console.log("worked");console.log(err) }
	query(q, data, callback)
	res.end();
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
	var user_id = req.params.user_id;
	console.log("died here")
	var q = 'select id from song where user_id=$1';
	var data = [user_id];
	var callback = function(err, data) { 
		console.log(err, data)
		console.log('inside')
		var song_ids = []
		for (var i = 0; i < data.rows.length; i++) {
			song_ids.push(data.rows[i].id)
		}
		res.end(song_ids.toString())
	}
	query(q, data, callback)
})

/*
router.get('/caption/:img_name', function(req, res) {
	var img_name = req.params.img_name;
	var q = 'select caption from image where file_name=$1 limit 1';
	var data = [img_name]
	var callback = function(err, result) {
		if (err) {console.log(err)}
		var caption = result.rows[0].caption
		res.end(caption)

	
	}
	query(q, data, callback)
})
*/

var uploadFolderPath = function(fileName) {
	var filePath = '../' + uploadDestination + fileName
	filePath = path.join(__dirname, filePath)
	return filePath
}

router.get('/play/:fileName', function(req, res) {
	//first rewrite file under the uploads/ folder ie hacky
	//	this is so we dont have to send binary image
	console.log('inside')	
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


module.exports = router;

