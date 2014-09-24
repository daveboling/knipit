(function(){
  'use strict';

  var flip = angular.module('knipit');

  flip.controller('FlipCtrl', ['$scope', '$routeParams', 'Deck', function($scope, $routeParams, Deck){
    $scope.title = 'FLIP IT YO';
    $scope.deck = {};
    $scope.cardIndex = 0;
    $scope.currentCard = {};
    $scope.flipped = false;
    $scope.progress = {complete: 0, wrong: 0, correct: 0, deckSize: 0};

    Deck.selectDeck($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      $scope.progress.deckSize = $scope.deck.cards.length;
    });

    $scope.nextCard = function(){
      //increment card index
      $scope.cardIndex++;
      //assign new card to the next card in index
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      //check if end has been reached
      if(!$scope.currentCard) { $scope.currentCard = 'End reached!';}
    };


    $scope.thumbs = function(direction){
      console.log(direction);
      if(direction === 'up'){
        $scope.progress.correct++;
      }else{
        $scope.progress.wrong++;
      }

      $scope.progress.complete++;
      $scope.nextCard();
      $scope.flipped = false;
    };

    $scope.flipCard = function(){
      $scope.flipped = true;
    };


  }]);

})();
