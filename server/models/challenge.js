'use strict';

var Mongo = require('mongodb');

function Challenge(o){
  this.senderId     = o.senderId;
  this.receiverId   = o.receiverId;
  this.deckId       = o.deckId;

  //scoring
  this.senderScore   = 0;
  this.receiverScore = 0;

  //flag for if receiver accepts/declines
  this.hasAccepted = false;
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
  //prevent duplicate challenges and overwriting current ones
  Challenge.collection.findOne(info, function(err, challenge){
    console.log(challenge);
    if(challenge) { return cb();}
    var c = new Challenge(info);
    Challenge.collection.save(c, cb);
  });
};


module.exports = Challenge;


