var mongoose = require('mongoose');

//connect to CommentSystemDB
mongoose.connect('mongodb://localhost/CommentSystemDB', {
  mongoose: {
    safe: true
  }
}, function(err) {
  if (err) {
    return console.error('Mongoose - connection error:', err);
  }

  console.log('db connected');
});

mongoose.set('debug', true);

module.exports = mongoose;