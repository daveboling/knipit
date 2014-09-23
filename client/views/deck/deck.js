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
      $scope.editMode = false;
    };

  }]);

})();
