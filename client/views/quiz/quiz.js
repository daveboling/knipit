(function(){
  'use strict';

  var quiz = angular.module('knipit');

  quiz.controller('QuizCtrl', ['$scope', '$routeParams', '$location', 'Deck', function($scope, $routeParams, $location, Deck){
    $scope.deck = {};
    $scope.cardIndex = 0;
    $scope.currentCard = {};
    $scope.flipped = false;
    $scope.isComplete = false;
    $scope.progress = {complete: 0, wrong: 0, correct: 0, deckSize: 0};

    Deck.quiz($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      $scope.progress.deckSize = $scope.deck.cards.length;
    });

    $scope.$on('complete', function(){
      //save progress
      $scope.deck.progress = $scope.progress;
      Deck.save($scope.deck).then(function(res){
        toastr.success('Your progress has been updated!');
      });
    });

    $scope.answer = function(choice){
      if(choice === $scope.currentCard.answer){
        $scope.progress.correct++;
      }else{
        $scope.progress.wrong++;
      }

      $scope.progress.complete++;
      $scope.nextQuestion();
    };

    $scope.nextQuestion = function(){
      //increment card index
      $scope.cardIndex++;
      //assign new card to the next card in index
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      //check if end has been reached
      if(!$scope.currentCard) {
        $scope.$emit('complete');
        $scope.isComplete = true;
      }
    };

    $scope.shuffle = function(){
      //shuffle array
      $scope.deck.cards = _.shuffle($scope.deck.cards);

      //reset session
      resetSession();
    };

    $scope.again = function(){
      $scope.isComplete = false;
      resetSession();
    };

    $scope.goToDashboard = function(){
      $location.path('/user-home');
    };

    //HELPER FUNCTIONS

    //reset card session for when user is in middle of game
    function resetSession(){
      $scope.cardIndex = 0;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      $scope.progress = {complete: 0, wrong: 0, correct: 0, deckSize: $scope.deck.cards.length};
    }

  }]);

})();
