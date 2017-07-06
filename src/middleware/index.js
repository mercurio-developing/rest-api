var basicAuth = require('basic-auth');
var User = require("../models/user");


function reqCredentials(req, res, next) {
 	const auth = basicAuth(req);
   if (auth) {
         	User.authenticate (auth.name, auth.pass,function(err, user){
 	   		if (err){
 	   			var err = new Error('Not authorization');
                err.status = 401;
                return next(err)
 	   		} else {
 	   			req.user = user
 	   			return next()
 	   		}
 	   	});
	  } else {
	   req.user = false;
	   var err = new Error('Not authorization');
	   err.status = 401;
	   return next(err);  
	  }
	}
	
module.exports.reqCredentials = reqCredentials;