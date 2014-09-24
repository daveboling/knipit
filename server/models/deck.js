'use strict';

var Mongo = require('mongodb');
    //_     = require('underscore');

function Deck(o, ownerId){
  this.name     = o.name;
  this.category = o.category;
  this.ownerId  = ownerId;

  //each deck starts with 0 cards
  this.cards    = [];
  this.progress = 0; //to be used as a progress report

}

Object.defineProperty(Deck, 'collection', {
  get: function(){return global.mongodb.collection('decks');}
});

Deck.findById = function(deckId, cb){
  var _id = Mongo.ObjectID(deckId);
  Deck.collection.findOne({_id: _id}, cb);
};

Deck.create = function(deck, userId, cb){
  var d = new Deck(deck, Mongo.ObjectID(userId));
  Deck.collection.save(d, cb);
};

Deck.findAllByUserId = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  Deck.collection.find({ownerId: _id}).toArray(cb);
};

Deck.saveChanges = function(deck, cb){
  //recast into Mongo ObjectIDs
  deck._id = Mongo.ObjectID(deck._id);
  deck.ownerId = Mongo.ObjectID(deck.ownerId);
  Deck.collection.save(deck, cb);
};

//Deck.findAll - for public display

//Deck.copy


module.exports = Deck;
