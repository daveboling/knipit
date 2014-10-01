'use strict';

var History = require('../models/history');


exports.index = function(req, res){
  History.all(req.user._id, function(err, history){
    res.send({history: history});
  });
};
