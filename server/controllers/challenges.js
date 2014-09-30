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
