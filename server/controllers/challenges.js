'use strict';

var Challenge = require('../models/challenge');


exports.new = function(req, res){
  Challenge.create(req.body, function(err, challenge){
    res.status(200).end();
  });
};

exports.getChallenges = function(req, res){
  Challenge.all(req.user._id, function(err, challenges){
    console.log(challenges);
    res.send({challenges: challenges});
  });
};

exports.accept = function(req, res){
  Challenge.accept(req.params.challengeId, function(err, challenges){
    res.status(200).end();
  });
};

exports.decline = function(req, res){
  Challenge.decline(req.params.challengeId, function(err, challenge){
    res.status(200).end();
  });
};


