'use strict';

var User = require('../models/user');

exports.register = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.status(200).end();
    }else{
      res.status(400).end();
    }
  });
};

exports.login = function(req, res){
  User.login(req.body, function(err, user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.setHeader('X-Authenticated-User', user.email);
          var userData = user;
          delete userData.password;
          res.send({user: userData});
        });
      });
    }else{
      res.status(401).end();
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.setHeader('X-Authenticated-User', 'anonymous');
    res.status(200).end();
  });
};

exports.checkSession = function(req, res){
  if(req.user){
    res.send({user: req.user});
  }else{
    //will remain anonymous until refresh
    //this is handled client side
    res.send({user: {username: 'Anonymous'}});
  }
};

