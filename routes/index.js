var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')

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

//reggie trying something
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
						return filename + Date.now()
					}
}))


router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
 //change above to send {image: 'uwblock.jp'}
 
  res.sendFile(path.join(__dirname, '../views/index.html'))
	
	
});



//Testing connecting to database
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
var getClient = function() {
	return new pg.Client(connectionString)
	return new pg.Client({user: 'reggiej7',
									database: 'reggiej7',
									//the host is going to be diff for cindy so we'll need to figure that out.
									//https://github.com/brianc/node-postgres/issues/613
									host: '/var/run/postgresql',
									port: 5432});
}

router.get('/database', function(req, res) {
	/*
	var client = new pg.Client(connectionString);
	client.connect();
	var query = client.query('SELECT * FROM admin')
	console.log(query);	
	
	res.render('index', { title: query });
	client.end();	
	*/
//	console.log(pg);
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
	//var client = new pg.Client(connectionString);
	console.log("first")
	var client = new pg.Client({user: 'reggiej7',
									database: 'reggiej7',
									host: '/var/run/postgresql',
									port: 5432});
	console.log("second")

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

/*
router.get('/upload', function(req, res) {
	
	var client = new pg.Client({user: 'reggiej7',
									database: 'reggiej7',
									host: '/var/run/postgresql',
									port: 5432});
	client.connect();
	var query = client.query({text: "abc"})
});
*/

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
	var client = getClient()
	 client.connect()
  	 client.query('select img from temp limit 1',
                     function(err, readResult) {
    console.log('err',err,'pg readResult',readResult);
    fs.writeFile('/tmp/foo.jpg', readResult.rows[0].img);
    res.json(200, {success: true});
  });
});


router.get('/image.html', function(req,res) {
  res.sendFile(path.join(__dirname, '../views/image.html'))
})

router.post('/upload', function(req, res) {
	//file is being uploaded in form in image.html
   console.log(req.files['files[]'])
	var fileName = '../' + uploadDestination + req.files['files[]'].name //this is so hacky. fix it reggie
	fileName = path.join(__dirname, fileName)

	//put file in db
	fs.readFile(fileName, 'hex', function(err, imgData) {
		if (err) { console.log(err)}
        imgData = '\\x' + imgData;
		  var client = getClient()
		  client.connect()
        client.query('insert into temp values (\'reggie\', $1)',
                           [imgData],
                           function(err, writeResult) {
										if (err) {
          								console.log('err',err,'pg writeResult',writeResult);
										} else {
											//after query ends, retrieve file from db
											console.log("got it going so far!!!!!")	

									 		client.query('select img from temp limit 1', function(err, readResult) {
											 	console.log('err',err,'pg readResult',readResult);
											 	fs.writeFile('/tmp/full.jpg', readResult.rows[0].img);
												var img = fs.readFileSync(path.join(__dirname, '../uploads/lion.jpg'))
												//res.writeHead(200, {'Content-Type': 'image/jpg'})
												res.contentType = 'image/jpg'
												res.end(img, 'binary')	
												//res.sendFile(path.join(__dirname, '../uploads/lion.jpg'))
									 	 	})
										}

			});
	})
	//retrieve file from db
		
	//add picture in response to send back to browser
})

router.get('/upload', function(req, res) {
	var app = require('../app')
	console.log(app.locals.homeDir)	
	 var img = fs.readFileSync(path.join(__dirname, '../uploads/lion.jpg'))
	 res.contentType = 'image/jpg'
	 res.end(img, 'binary')	
});




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


module.exports = router;
