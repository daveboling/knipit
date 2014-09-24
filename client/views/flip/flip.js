(function(){
  'use strict';

  var flip = angular.module('knipit');

  flip.controller('FlipCtrl', ['$scope', '$routeParams', 'Deck', function($scope, $routeParams, Deck){
    $scope.title = 'FLIP IT YO';
    $scope.deck = {};
    $scope.cardIndex = 0;
    $scope.currentCard = {};
    $scope.isQuestion = true;

    Deck.selectDeck($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
    });

    $scope.nextCard = function(){
      $scope.cardIndex++;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      if(!$scope.currentCard) { $scope.currentCard = 'End reached!';}
    };

    $scope.thumbsUp = function(){
      //a point for the progress
      $scope.nextCard();
    };

    $scope.thumbsDown = function(){
      //a point against progress
      $scope.nextCard();
    };

    $scope.showAnswer = function(){
      $scope.isQuestion = false;
      $scope.isAnswer = true;
    };


  }]);

})();
