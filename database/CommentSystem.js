var mongoose = require('./CommentSystemDB');

var Schema = mongoose.Schema;

/*The data structure for comments, for both article and comment 
	author: the user who submit the comment
	content: the content of the article or coment
	time: the time when this comment is submitted
	point: user can upvote and downvote a comment, 
			the point is computed by upvote - downvote
	parentId: for an article, the id is set to 0
				for a comment, this id is the id of the comment/article it is attached to
*/
var CommentSystemSchema = new Schema({ 
    author  	: {type:String,default:""},
    content 	: {type:String,default:""},
    time    	: { type: Date, default: Date.now },
    point   	: { type: Number, default: 0},
    parentId 	: { type: String, default: "0"}
});

var CommentSystem = mongoose.model('CommentSystem', CommentSystemSchema);

module.exports = CommentSystem;