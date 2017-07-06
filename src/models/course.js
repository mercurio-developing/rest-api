'user strict'

const mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose); 


const Schema =  mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

CourseSchema = new Schema ({

	user : {
		type: ObjectId,
		ref: 'User'
	},
	    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [{
        stepNumber: Number,
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
	reviews : [{
		type: ObjectId,
		ref:'Review'
		}]
	}).plugin(deepPopulate,{ //plugin deep populate
        populate:{
       'user': {
         select: 'fullName' //filter the populate only fullName
    }
  }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;

