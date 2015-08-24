var mongoose = require('./CommentSystemDB');

var Schema = mongoose.Schema;


/*The data structure for vote record
	author: the user who made this vote
	commentId: the comment which is voted
	isUpvote: is the vote a upvote
*/
var VoteSchema = new Schema({ 
    author  	: {type:String, default:""},
    commentId 	: {type:String, default:"0"},
    isUpvote	: {type:Boolean, default:true}
});

var VoteInfo = mongoose.model('VoteInfo', VoteSchema);

module.exports = VoteInfo;