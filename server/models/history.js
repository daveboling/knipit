'use strict';


var Mongo = require('mongodb'),
    async = require('async');


function History(o){
  this.receiverId        = Mongo.ObjectID(o.receiverId);
  this.senderId          = Mongo.ObjectID(o.senderId);
  this.deckId            = Mongo.ObjectID(o.deckId);

  this.receiverScore     = o.receiverScore;
  this.challengerScore   = o.challengerScore;
  this.winner            = o.winner;
  this.date              = new Date();
}

Object.defineProperty(History, 'collection', {
  get: function(){return global.mongodb.collection('history');}
});

History.create = function(challenge, cb){
  var h = new History(challenge);
  History.collection.save(h, cb);
};

History.all = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  History.collection.find({$or:[{receiverId: _id},{senderId: _id}]}).toArray(function(err, history){
    //if no history, do nothing
    if(!history){ return cb(); }

    //assign current user to history for getting user data
    history.forEach(function(h){
      h.currentUserId = _id;
    });

    //assign relevant data to history
    async.map(history, getPublicUserData, function(err, publicUsers){
      async.map(history, getDeckInfo, function(err, deckInfo){

        //assign info to each index of history
        //publicUsers and deckInfo should mirror the history array
        history.forEach(function(h, index){
          h.user = publicUsers[index];
          h.deck = deckInfo[index];
        });

        //callback with information
        cb(null, history);
      });
    });
  });
};

module.exports = History;


////HELPER FUNCTIONS
function getPublicUserData(history, cb){
  var publicUser = history.senderId.toString();

  //check to see who the other user is
  if(publicUser === history.currentUserId.toString()){
    publicUser = history.receiverId.toString();
  }


  //find the user and only return the name, because that's all we need.
  require('./user').findById(publicUser, function(err, user){
    var username = {username: user.username};
    cb(null, username);
  });
}

function getDeckInfo(history, cb){
  require('./deck').findById(history.deckId.toString(), function(err, deck){
    var deckInfo = {name: deck.name, category: deck.category};
    cb(null, deckInfo);
  });
}
