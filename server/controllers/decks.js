'use strict';

var Deck = require('../models/deck');

exports.new = function(req, res){
  console.log(req.body);
  Deck.create(req.body, req.user._id, function(err, deck){
    res.send({deck: deck});
  });
};

exports.localDecks = function(req, res){
  Deck.findAllByUserId(req.user._id, function(err, decks){
    res.send({decks: decks});
  });
};

exports.select = function(req, res){
  Deck.findById(req.params.deckId, function(err, deck){
    res.send({deck: deck});
  });
};

exports.saveChanges = function(req, res){
  Deck.saveChanges(req.body, function(err, deck){
    res.send({deck: deck});
  });
};
