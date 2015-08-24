var express = require('express');
var commentSystem = require('./../database/CommentSystem');
var voteInfo = require('./../database/VoteInfo');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  //redirect to the main page
  res.redirect('main');
});

/*Get the main page*/
router.get('/main', function(req, res, next) {
  /*send all comments to display in webpage*/
  commentSystem.find({}, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {
      res.render('main', {"comments":docs});
    }
  });
});

//create a new vote information
function CreateNewVoteInfo(author, upvote, id) {
  var newVoteInfo = new voteInfo({author: author, isUpvote: upvote, commentId: id});
  newVoteInfo.save(function (err, data) {
    if (err) {
      return err;
    } else if (upvote){
      UpdatePointInfo(id, 1);
    } else {
      UpdatePointInfo(id, -1);
    }
  });
  return;
}

//update the point information in CommentSystem
function UpdatePointInfo(id, num){
  commentSystem.findByIdAndUpdate(id, {
    //increase the point by num
    $inc: {
      point: num
    }, 
  }).exec();
  //return;
}

/*when a user upvote a comment
  1. If this user has upvoted this comment => cancel the previous upvote
  2. If this is the first time this user upvote it => upvote it
  3. If this user has downvoted this comment =>cancel the previous downvote and upvote it.
*/
router.put('/upvote', function (req, res) {
    var author = req.body.author;
    var id = req.body.id;

    voteInfo.find({ 'commentId': id, 'author':author }, function (err, docs) {
      if (err) {console.err(err);}
      var length = docs.length;
      var result = 0;
      if (length > 1) {
        res.send("Error");
      } else if (length === 0){
        //case 2: create a new vote information
        CreateNewVoteInfo(author, true, id);
        result = 1;
      } else if (!(docs[0].isUpvote)){
        //case 3: update all informations to upvote
          UpdatePointInfo(id, 2);
          docs[0].update({ isUpvote: true }).exec();
          result = 2;
      } else {
        //case 1: cancel the previous upvote
        docs[0].remove(function(err){
          if (err) {
            res.send("Error");
          }
        });
        UpdatePointInfo(id, -1);
        result = -1;
      }
      commentSystem.findById(id, function(err, found){
          res.end(result.toString());
      });
      return;
    });
});

/*when a user downvote a comment
  1. If this user has downvote this comment => cancel the previous downvote
  2. If this is the first time this user downvote it => downvote it
  3. If this user has upvoted this comment =>cancel the previous upvote and downvote it.
*/
router.put('/downvote', function (req, res) {
    var author = req.body.author;
    var id = req.body.id;
    voteInfo.find({ 'commentId': id, 'author':author }, function (err, docs) {
      if (err) {console.err(err);}
      var length = docs.length;
      var result = 0;
      if (length > 1) {
        res.send("Error");
      } else if (length === 0){
        //case 2: create a new vote information
        CreateNewVoteInfo(author, false, id);
        result = -1;
      } else if (!(docs[0].isUpvote)){
        //case 3: update all informations to downvote
        docs[0].remove(function(err){
          if (err) {
            res.send("Error");
          }
        });
        UpdatePointInfo(id, 1);
        result = 1;
      } else {
        //case 1: cancel the previous downvote
        UpdatePointInfo(id, -2);
        docs[0].update({ isUpvote: false }).exec();
        result = -2;
      }
      commentSystem.findById(id, function(err, found){
          res.end(result.toString());
      });
    });
});


/* when a user add a comment/article */
router.post('/addcomment', function(req, res) {
  var content = req.body.content;
  var author = req.body.author;
  var parentId = req.body.parentId;
  if (!parentId) {
    parentId = "0";
  }
  //create a new comment information
  var newComment = new commentSystem({author: author, content: content, parentId: parentId});
  newComment.save(function (err, data) {
    if (err) {
      return console.error(err);
    }
    else {
      res.end(newComment._id.toString());
    }
  });
});

module.exports = router;
