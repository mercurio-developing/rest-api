'use strict';

var express = require("express");
var router = express.Router();
var User = require("../models/user");
var mid  = require("../middleware")
var bcrypt = require('bcryptjs');
const basicAuth = require("basic-auth");

//GET user "/"
router.route("/")
      .get(mid.reqCredentials,function(req,res,next){ //get user with middleware of validation credentials
		 if (req.user) {
		 		res.status(200) //send OK
		        res.json(req.user); //show the json of user with credential
		    } else {
		    	var err = new Error('"Without authorization')
		    	err.status = 401;
		    	return next(err)
		    }
 		})
// POST "/"
	  .post(function(req, res, next) { //Create a new user
		  if (req.body.emailAddress &&
		    req.body.fullName &&
		    req.body.password) {  //check all in the form

		      // create object 
		      var userData = {
		        fullName: req.body.fullName,
		        emailAddress: req.body.emailAddress,
		        password: req.body.password
		      };

		      // use schema's `create` method to insert document into Mongo
		      User.create(userData, function (err, user) {
		        if (err){
		            const err = new Error('That user already exists');
		            err.status = 500;
		            return next(err)
		        } else {
		          res.status(201).location('/').end(); //send Created and change location and end
		        }
		      });

		    } else {
		      var err = new Error('All fields required.'); //validation for all fields
		      err.status = 400;
		      return next(err);
		    }
		});

module.exports = router;