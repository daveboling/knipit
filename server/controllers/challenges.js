'use strict';

var Challenge = require('../models/challenge');


exports.new = function(req, res){
  Challenge.create(req.body, function(err, challenge){
    res.status(200).end();
  });
};

exports.getChallenges = function(req, res){
  Challenge.all(req.user._id, function(err, challenges){
    res.send({challenges: challenges});
  });
};

exports.decline = function(req, res){
  Challenge.decline(req.params.challengeId, function(err, challenge){
    res.status(200).end();
  });
};

exports.complete = function(req, res){
  Challenge.complete(req.params.challengeId, req.body.score, function(err, challenge){
    res.status(200).end();
  });
};


