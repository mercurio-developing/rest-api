'use strict'; //Declare modules

var express = require("express");
var router = express.Router();
var Course = require("../models/course");
var Review = require("../models/review");
var mid = require("../middleware");

router.route("/")  //get and find in Course al courses with title
   	  .get(function (req, res, next) {
   	Course.find({},"title",function(err, courses){
   		if(!courses){
   			return next(err)  //return err in case of problems
   		}else {
       		res.status(200).json(courses); //send status OK and json of courses
   		}
   	});
})
   	  .post(mid.reqCredentials,function(req, res , next){ //post course with credentials requirenment
   	  		if(req.user){ //if the credentials is true
   	  		var course = new Course(req.body) //create the object  Course with req.body
   	  		course.save(function(err, newCourse){ //and saved
   	  			if(err) {
              var err = new Error('All fields required.'); //validation for all fields
   	  				err.status = 400; //send error 400
   	  				return next(err)
   	  			} else{
   	  				res.status(201); // send Created
   	  				res.location('/');//go to location and end
   	  				res.end();	
   	  			}
   	  		});
          } else {
            err = new Error('"Without authorization')
            err.status = 401;
            return next(err)
            }
   	  	});
   
router.route("/:courseId")  //get course for id with credential requirement in middleware
      .get(function(req, res, next){
		  Course.findById(req.params.courseId) //find course by id with the params courseId
		 	  .populate({
          path: 'reviews',
          model: 'Review',
          populate: {
            path: 'user',
            select:'fullName',
            model: 'User'
          }
        })
        .deepPopulate('user')
		 	  .exec(function(err, course){
			if(!course){
        var err = new Error('"Without authorization')
				res.status = 401 //if is error send not authorization
				return next(err)
			} else {
       			res.status(200).json(course);//send status OK and show json course
			}
		  });	
	})	
     .put(mid.reqCredentials, function(req, res,next) { //update information in course with middleware
   	if(req.user) {

    if(req.body.title && req.body.description && req.body.steps){
    var id = req.params.courseId; 
    Course.findByIdAndUpdate(id, { //Course find by ID and UPDATE 
    	$set: {
    		title : req.body.title,  //title description and steps is updated with the req.body
    		description: req.body.description,
    		steps : req.body.steps
    }},{new:true},
        function(err,update) {
            if (err) {
                var err = new Error('All fields required.'); //validation for all fields
                err.status = 400; //send error 400
                return next(err);
            }
            res.status(204); //send Non Content
            res.location("/");//change location
            res.end();
        });
	   } else {

      var err = new Error('All fields required.'); //validation for all fields
          err.status = 400;
          return next(err);

     }

  } else {
		err = new Error('"Without authorization')
		err.status = 401;
		return next(err)
		}
	});


router.post("/:courseId/reviews",mid.reqCredentials,function(req,res,next){ //post the review with middleware of validation
		if (req.user){ //if credentials is OK

		Course.findById(req.params.courseId,function(err, course){ //search by ID
		
		const review = new Review(req.body) //generate new review with the req body in Review
		review.save(function(err, newReview){ //save this
   	  			if(err) {
              var err = new Error('All fields required.'); //validation for all fields
   	  				err.status = 400;
   	  				return next(err)
   	  			}
   	  			course.reviews.push(newReview); //push newReview to reviews of course
   	  			course.save(function(err, course){ //and saved
   	  				if(err){
                var err = new Error('All fields required.'); //validation for all fields
   	  					err.status = 400;
   	  					return next(err)
   	  				} 

   	  				res.status(201) //send status Created and change location to the course
   	  				res.location("/" + req.params.courseId)
   	  				res.end();
   	  			});
   	  		});
		});

		} else {
			err = new Error('"Without authorization')
			err.status = 401;
			return next(err)
		}
	});


module.exports = router