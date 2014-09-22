'use strict';

var Deck = require('../models/deck');

exports.new = function(req, res){
  console.log(req.body);
  Deck.create(req.body, req.user._id, function(err, deck){
    res.send({deck: deck});
  });
};
