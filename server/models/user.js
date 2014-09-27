'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb');

function User(o){
  this.username      = o.username;
  this.password      = bcrypt.hashSync(o.password, 10);
  this.email         = o.email;

  this.wins          = 0;
  this.losses        = 0;
  this.slayings      = 0;
  this.rating        = {up: 0, down: 0};
  this.overallRating = 0;
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user || o.password.length < 3){return cb();}
    var u = new User(o);
    User.collection.save(u, cb);
  });
};

User.login = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(null, user);
  });
};

module.exports = User;

