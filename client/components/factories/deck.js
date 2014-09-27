(function(){
  'use strict';

  var deck = angular.module('knipit');

  deck.factory('Deck', ['$http', function($http){
    //create deck for logged in user
    function createDeck(deck){
      return $http.post('/deck/create', deck);
    }

    //get decks for logged in user
    function getDecks(){
      return $http.get('/decks/all/');
    }

    //select deck for edit mode
    //also handles flip mode
    function selectDeck(deckId){
      return $http.get('/deck/'+deckId+'/view');
    }

    //save changes made from edit mode, deck sent is already an object
    function save(deck){
      return $http.post('/deck/save', deck);
    }

    //quiz mode
    function quiz(deckId){
      return $http.get('/quiz/'+deckId);
    }

    //delete deck
    //flip deck
    //edit deck


    //HELPER FUNCTIONS
    function removeEmptyCards(cards){
      //convert empty cards to falsy values
      var newCards = cards.map(function(card){
          if(card.question === '' && card.answer === ''){
            return '';
          }else{
            return card;
          }
      });

      //return array without falsy values
      return _.compact(newCards);
    }

    return {createDeck: createDeck,
              getDecks: getDecks,
            selectDeck: selectDeck,
                  quiz: quiz,
                  save: save,
      removeEmptyCards: removeEmptyCards
          };
  }]);




})();
