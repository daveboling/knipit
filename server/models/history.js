'use strict';


var Mongo = require('mongodb');


function History(o){
  this.receiverId        = Mongo.ObjectID(o.receiverId);
  this.challengerId      = Mongo.ObjectID(o.challengerId);

  this.receiverScore     = o.receiverScore;
  this.challengerScore   = o.challengerScore;
  this.date              = new Date();
}

Object.defineProperty(History, 'collection', {
  get: function(){return global.mongodb.collection('history');}
});

History.create = function(challenge, cb){
  var h = new History(challenge);
  History.collection.save(h, cb);
};

//get history

module.exports = History;
