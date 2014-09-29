'use strict';

var Challenge = require('../models/challenge');


exports.new = function(req, res){
  Challenge.create(req.body, function(err, challenge){
    res.status(200).end();
  });
};
