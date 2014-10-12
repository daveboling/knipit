'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb');

function User(o){
  this.username      = o.username;
  this.password      = bcrypt.hashSync(o.password, 10);
  this.email         = o.email;

  this.wins          = 0;
  this.draws         = 0;
  this.allTimeScore  = 0;
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user || o.password.length < 3){return cb();}
    var u = new User(o);
    User.collection.save(u, cb);
  });
};

User.login = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

User.addWin = function(winnerId, cb){
  User.findById(winnerId, function(err1, user){
    //recast MongoID
    user._id = Mongo.ObjectID(user._id);
    //add win
    user.wins++;
    User.collection.save(user, function(err2){
      cb(user);
    });
  });
};

User.addDraw = function(receiverId, senderId, cb){
  User.findById(receiverId, function(err, receiver){
    User.findById(senderId, function(err, sender){
      //recast MongoID
      receiver._id = Mongo.ObjectID(receiver._id);
      sender._id = Mongo.ObjectID(sender._id);

      //add draws
      receiver.draws++;
      sender.draws++;

      //save users
      User.collection.save(receiver, function(err){
        User.collection.save(sender, cb);
      });

    });
  });
};

User.getLeaders = function(cb){
  User.collection.find().sort({wins: -1}).limit(10).toArray(function(err1, wins){
    User.collection.find().sort({allTimeScore: -1}).limit(10).toArray(function(err2, score){
      cb(null, wins, score);
    });
  });
};

User.updateUserScore = function(userId, score, cb){

  //check userId type
  if(typeof userId === Object){
    userId = userId.toString();
  }

  //find user
  User.findById(userId, function(err, user){
    user.allTimeScore += score;
    user._id = Mongo.ObjectID(user._id);
    User.collection.save(user, cb);
  });
};

module.exports = User;

