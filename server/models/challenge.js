'use strict';

var Mongo    = require('mongodb'),
    async    = require('async'),
    User     = require('./user'),
    Deck     = require('./deck');

function Challenge(o){
  this.senderId      = Mongo.ObjectID(o.senderId);
  this.receiverId    = Mongo.ObjectID(o.receiverId);
  this.deckId        = Mongo.ObjectID(o.deckId);

  //scoring
  this.challengerScore   = o.challengerScore;
  this.receiverScore     = 0;

  //flag for if receiver accepts/declines
  this.hasAccepted   = false;

  //check if completed
  this.senderComplete   = false;
  this.receiverComplete = false;
}

Object.defineProperty(Challenge, 'collection', {
  get: function(){return global.mongodb.collection('challenges');}
});

Challenge.findById = function(deckId, cb){
  var _id = Mongo.ObjectID(deckId);
  //going to want to find userId here for printing out on user profile
  Challenge.collection.findOne({_id: _id}, cb);
};

Challenge.create = function(info, cb){
  var score  = info.challengerScore;

  //may be ineffecient to do it this way, but it's needed
  //checking for duplicate object is turning this into MongoID
  delete info.challengerScore;

  //remaing keys for MongoID
  var keys = Object.keys(info);

  //recast into Mongo Object IDs
  keys.forEach(function(key){
    info[key] = Mongo.ObjectID(info[key]);
  });

  //prevent duplicate challenges and overwriting current ones
  Challenge.collection.findOne(info, function(err, challenge){
    //if it already exists, disallow creation of new challenge
    if(challenge) { return cb();}
    var c = new Challenge(info);
    c.challengerScore = score;
    Challenge.collection.save(c, cb);
  });
};

Challenge.all = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  Challenge.collection.find({$or:[{receiverId: _id},{senderId: _id}]}, {isComplete: false}).toArray(function(err, challenges){
    //if no challenges, do nothing
    if(!challenges){ return cb(); }

    //assign current user to challenges for getting user data
    challenges.forEach(function(c){
      c.currentUserId = _id;
    });

    //assign relevant data to challenges
    async.map(challenges, getPublicUserData, function(err, publicUsers){
      async.map(challenges, getDeckInfo, function(err, deckInfo){

        //assign info to each index of challenges
        //publicUsers and deckInfo should mirror the challenges array
        challenges.forEach(function(c, index){
          c.user = publicUsers[index];
          c.deck = deckInfo[index];
        });

        //callback with information
        cb(null, challenges);
      });
    });
  });
};

Challenge.accept = function(challengeId, cb){
  Challenge.findById(challengeId, function(err, challenge){
    challenge.hasAccepted = true;
    Challenge.collection.save(challenge, cb);
  });
};

Challenge.decline = function(challengeId, cb){
  var _id = Mongo.ObjectID(challengeId);
  Challenge.collection.remove({_id: _id}, cb);
};



module.exports = Challenge;


////HELPER FUNCTIONS
function getPublicUserData(challenge, cb){
  var publicUser = challenge.senderId.toString();

  //check to see who the other user is
  if(challenge.senderId.toString() === challenge.currentUserId.toString()){
    publicUser = challenge.receiverId.toString();
  }

  //find the user and only return the name, because that's all we need.
  User.findById(publicUser, function(err, user){
    var username = {username: user.username};
    cb(null, username);
  });
}

function getDeckInfo(challenge, cb){
  Deck.findById(challenge.deckId.toString(), function(err, deck){
    var deckInfo = {name: deck.name, category: deck.category};
    cb(null, deckInfo);
  });
}
