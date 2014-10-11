'use strict';

var Mongo = require('mongodb'),
    _     = require('underscore');

function Deck(o, ownerId){
  this.name     = o.name;
  this.category = o.category;
  this.ownerId  = ownerId;

  //each deck starts with 0 cards
  this.cards    = [];
  this.rating   = {up: 0, down: 0};
  this.progress = {complete: 0, wrong: 0, correct: 0, deckSize: 0}; //to be used as a progress report

}

Object.defineProperty(Deck, 'collection', {
  get: function(){return global.mongodb.collection('decks');}
});

Deck.findById = function(deckId, cb){
  var _id = Mongo.ObjectID(deckId);
  Deck.collection.findOne({_id: _id}, cb);
};

Deck.create = function(deck, userId, cb){
  var d = new Deck(deck, Mongo.ObjectID(userId));
  Deck.collection.save(d, cb);
};

Deck.findAllByUserId = function(userId, cb){
  var _id = Mongo.ObjectID(userId);
  Deck.collection.find({ownerId: _id}).toArray(function(err, decks){
    decks.forEach(function(deck, index){
      decks[index].report = deckReport(deck.progress);
    });
    cb(err, decks);
  });
};

Deck.saveChanges = function(deck, cb){
  //recast into Mongo ObjectIDs
  deck._id = Mongo.ObjectID(deck._id);
  deck.ownerId = Mongo.ObjectID(deck.ownerId);
  Deck.collection.save(deck, cb);
};

Deck.quiz = function(deckId ,cb){
  Deck.findById(deckId, function(err, deck){
    if(!deck.cards){return cb(err, deck);}
    deck.cards = createQuiz(deck.cards);
    cb(err, deck);
  });
};

Deck.search = function(query, userId, cb){
  Deck.collection.find({name: {$regex: '.*'+query.query+'.*', $options: 'i'}}).toArray(function(err, results){
    var filteredResults = removeDecks(results, userId);
    cb(null, filteredResults);
  });
};

Deck.rate = function(query, cb){
  Deck.findById(query.deckId, function(err, deck){
    //recast MongoID
    deck._id = Mongo.ObjectID(deck._id);

    //check rating up or down
    if(query.direction === 'up'){
      deck.rating.up++;
    }else{
      deck.rating.down++;
    }

    //save the deck
    Deck.collection.save(deck, cb);
  });
};

//removes ALL traces of a deck of cards
Deck.deleteDeck = function(deckId, cb){
  var _id = Mongo.ObjectID(deckId);
  Deck.collection.remove({_id: _id}, function(err){
    require('./history').removeDeckHistory(_id, function(err){
      require('./challenge').removeChallengeHistory(_id, cb);
    });
  });
};

module.exports = Deck;

//HELPER FUNCTIONS
function deckReport(progress){
  return Math.round((progress.correct / progress.deckSize) * 100);
}

function createQuiz(cards){
  var question = {},
      choices = [],
      quizArray = [],
      randomCards = [];

  //STEP 1

  //CREATE MULTIPLE CHOICES AT RANDOM
  cards.forEach(function(card, index){
    //question is equal to the current question getting multiple choices
    question = card;

    //shuffle them up really nicely
    randomCards = shuffle(cards);

    //grab 4 random cards
    for(var i = 0; i < 4; i++){
      //this is just in case the deck isn't bigger than at least 4 cards
      if(!randomCards[i]){
        choices.push('');
      }else{
        choices.push(randomCards[i].answer);
      }
    }

    //assign choices to given question
    question.choices = choices;

    //clear choices for next run
    choices = [];

    //push new questions to the quiz array
    quizArray.push(question);
  });

  //STEP 2

  //INTEGRATE A QUESTIONS'S ANSWER
  quizArray.forEach(function(question, index){
    var duplicateFound = false;

    //check to make sure the answer isn't already there
    question.choices.forEach(function(choice){
      if(question.answer === choice){duplicateFound = true; return;}
    });

    //check to see if duplicate found and assign
    if(!duplicateFound){
      question.choices[0] = question.answer;
    }

    //reset the duplicateFound flag
    duplicateFound = false;

    //assign reshuffled questions to quizArray!
    quizArray[index].choices = shuffle(question.choices);
  });

  //STEP 3

  return quizArray;
}

function shuffle(cards){
  var newDeck = [];
  //make it a good shuffle, shall we?
  for(var i = 0; i < 3; i++){
    newDeck = _.shuffle(cards);
  }
  return newDeck;
}

function removeDecks(results, currentUserId){
  var newResults = [];
  //remove decks with no enough cards and decks that belong to curently logged in user
  results.forEach(function(r, index){
    if(r.ownerId.toString() === currentUserId.toString()){
      return;
    }else if(r.cards.length < 4){
      return;
    }else{
      newResults.push(r);
    }
  });

  //remove 0s
  return newResults;
}
