'user strict'

const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');//i use bcryptjs for problems with linux and bcrypt

const Schema = mongoose.Schema;

const UserSchema =  new Schema ({
	
	fullName : {
		type : String,
		required : true
		},
	emailAddress: {
		type:String,
		required: true,
		unique:true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	},
	password:{
		type:String,
		required:true
	}
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(emailAddress, password, callback) {
  User.findOne({ emailAddress: emailAddress })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            const err = new Error("invalid password")
            err.status = 401;
            return callback(err);
          }
        })
      });
    } 
    
// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10 ,function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;


