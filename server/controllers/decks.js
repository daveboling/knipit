'use strict';

var Deck = require('../models/deck');

exports.new = function(req, res){
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

exports.quiz = function(req, res){
  Deck.quiz(req.params.deckId, function(err, deck){
    res.send({deck: deck});
  });
};

exports.saveChanges = function(req, res){
  Deck.saveChanges(req.body, function(err, deck){
    res.send({deck: deck});
  });
};

exports.search = function(req, res){
  Deck.search(req.query, function(err, results){
    res.send({results: results});
  });
};

exports.rateDeck = function(req, res){
  Deck.rate(req.body, function(err, deck){
    res.status(200).end();
  });
};

