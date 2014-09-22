'use strict';

function Deck(){
}

Object.defineProperty(Deck, 'collection', {
  get: function(){return global.mongodb.collection('decks');}
});

Deck.create = function(deck, userId, cb){
  deck.ownerId = userId;
  Deck.collection.save(deck, cb);
};



module.exports = Deck;
