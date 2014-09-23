(function(){
  'use strict';

  var deck = angular.module('knipit');

  deck.factory('Deck', ['$http', function($http){
    function createDeck(deck){
      return $http.post('/deck/create', deck);
    }

    function getDecks(){
      return $http.get('/decks/all/');
    }

    //select deck
    function selectDeck(deckId){
      return $http.get('/deck/'+deckId+'/view');
    }

    //delete deck
    //flip deck
    //edit deck


    return {createDeck: createDeck,
              getDecks: getDecks,
            selectDeck: selectDeck
          };
  }]);

})();
