var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')


router.get('/spotify', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/spotify_playlist.html'))
});




//reggie note to self since this is starting to get really messy: everything below this
//is pretty much demo/poc stuff. Leaving it in for reference in the near future.

var multer = require('multer')
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



//Testing connecting to database
var pg = require('pg');
var connectionString = process.env.DATABASE_URL

var getClient = function() {
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



var fs = require('fs')
router.get('/location', function(req, res) {
	fs.readFile('/tmp/james.png', function(err, imgData) {
		if (!err) { console.log("worked") } 
	})
});

router.get('/create', function(req,res) {
fs.readFile('/tmp/james.png', 'hex', function(err, imgData) {
        console.log('imgData',imgData);
        imgData = '\\x' + imgData;
		  var client = getClient()
		  client.connect()
        client.query('insert into temp values (\'reggie\', $1)',
                           [imgData],
                           function(err, writeResult) {
          console.log('err',err,'pg writeResult',writeResult);
    });
});
});


router.get('/image', function(req, res, next) {
	query('select img from temp where imgname=\'lion.jpg\'  limit 1', [], 
      function(err, readResult) {
				console.log('err',err,'pg readResult',readResult);
				var img = readResult.rows[0].img
				fs.writeFile('/tmp/foo.jpg', readResult.rows[0].img);
				res.contentType = 'image/jpg'
				res.end(img, 'binary')
 		 });
});


router.get('/image.html', function(req,res) {
  res.sendFile(path.join(__dirname, '../views/image.html'))
})


//refacto both /upload s 
router.post('/upload/:file_name', function(req, res) {
	//file is being uploaded in form in image.html
	//req.files['files[]'].name
	var fileName = req.params.file_name
	console.log(fileName)
	var filePath = '../' + uploadDestination + fileName
	filePath = path.join(__dirname, filePath)

	//put file in db
	fs.readFile(filePath, 'hex', function(err, imgData) {
		  if (err) { console.log(err)}
        imgData = '\\x' + imgData;
		  var client = getClient()
		  client.connect()
        client.query('insert into image values ($1, $2, $3, $4)', [fileName, 'jappleseed', 'picture caption yay!', imgData],
           function(err, writeResult) {
				 	if (err) {
          			console.log('err',err,'pg writeResult',writeResult);
					} else {
						//after query ends, retrieve file from db
				 		client.query('select img from image where file_name = \'' + fileName + '\' ', function(err, readResult) {
					 	console.log('err',err,'pg readResult',readResult);
						var img = fs.readFileSync(filePath)
						var img = readResult.rows[0].img
						res.contentType = 'image/jpg'
						res.end(img, 'binary')	
					})
				}
			});
	})
})


router.get('/upload/:file_name', function(req, res) {
	var app = require('../app')
	console.log(app.locals.homeDir)	
	 var img = fs.readFileSync(path.join(__dirname, '../uploads/' + req.params.file_name))
	 res.contentType = 'image/jpg'
	 res.end(img, 'binary')	
});

router.get('/caption/:file_name', function(req, res){
	//return the caption associated with a given photo file_name
	
	var file_name = req.params.file_name
	var q = "select caption from image where file_name = $1;"
	var data = [file_name]
	var callback = function(err, data) {console.log(data) }
	query(q, data, callback)	
	res.end()
	res.send("I made it")

})




//reggie:todo
//upload a photo (/image.html (post)), store it in db(/create), retrieve in db(/image), send back to browser ajaxy(/image.html)



//create
//read
//update
//delete

//choose profile
//add new res(redirect to new_resident.html)
//get resident profile:password and login

//add new res
//post new info
	//add a picture
	//add a song
	//add an interest
//go to edit pictures
//go to edit music

//choose views
//get home (go back)
//get family view
//get resident view

//choose puzzle
//log out back to view chooser
//select puzzle
//view slideshow

//choosing a profile (home.html)
//router.get('/home', 




router.get('/profile', function(req, res) {
	res.sendFile(path.join(__dirname, "../MemorableFrontEnd/f_profile.html"))
})

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
	var q = 'insert into song values ($1, $2)';
	var data = [song_id, user_id];
	var callback = function(err, data) { console.log(err) }
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


module.exports = router;

