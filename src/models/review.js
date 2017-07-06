'user strict'

var mongoose = require('mongoose');
var bcrypt =  require('bcrypt-nodejs');

var Schema =  mongoose.Schema,
	ObjectId =  Schema.Types.ObjectId

ReviewSchema = new Schema ({

	user: {
			type : ObjectId,
			ref: 'User'
		},
	postedOn: {
		type: Date,
		default: Date.now
	},
	rating: {
		type:Number,
		required:true,
		min: 1,
		max: 5 
	},
	review: String	
})


const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;