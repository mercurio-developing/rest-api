'use strict';

// load modules
const  express = require('express'),
   	    morgan = require('morgan'),
   	  mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
   		  seeder = require('mongoose-seeder'),
          data = require('./data/data.json'),

          User = require('./models/user'),
   	    Review = require('./models/review'),
   	    Course = require('./models/course'),
   	    
   
    userRoutes = require("./routes/users"),
 coursesRoutes = require("./routes/courses");

const app = express();

mongoose.connect("mongodb://localhost:27017/courses")

const db = mongoose.connection;

db.on("error",function (err){
	console.error("connection error:", err);
});

db.once("open", function(){
		seeder.seed(data).then(function(dbData) {
			console.log("Seedderrr")
		}).catch(function(err) {
		   console.error(err)
		});
});
// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

app.use("/api/users", userRoutes);
app.use("/api/courses",coursesRoutes);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
    res.send({
        message: err.message,
        error: err
    });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
