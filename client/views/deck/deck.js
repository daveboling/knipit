(function(){
  'use strict';

  var deck = angular.module('knipit');

  deck.controller('DeckCtrl', ['$scope', '$routeParams', 'Deck', function($scope, $routeParams, Deck){
    $scope.editMode = false;
    $scope.deck = {};

    //inital deck load
    Deck.selectDeck($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
    });

    $scope.editDeck = function(){
      $scope.editMode = true;
    };

    $scope.saveDeck = function(){
      //remove empty cards
      $scope.deck.cards = Deck.removeEmptyCards($scope.deck.cards);

      //save edited deck
      Deck.save($scope.deck).then(function(res){
        $scope.editMode = false;
      });
    };

    //enter key is pressed on the last answer input
    $scope.enterAddCard = function(e, last){
      if(e.keyCode === 13 && last){
        $scope.deck.cards.push({question: '', answer: ''});
        $(this).next().focus();
      }
    };

    //general add card button
    $scope.addCard = function(){
      $scope.deck.cards.push({question: '', answer: ''});
    };

  }]);

})();
