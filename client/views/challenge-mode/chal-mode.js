(function(){
  'use strict';

  var chalMode = angular.module('knipit');

  chalMode.controller('ChallengeCtrl', ['$scope', '$routeParams', '$location', '$interval', 'Deck', 'Challenge', function($scope, $routeParams, $location, $interval, Deck, Challenge){
    $scope.deck         = {};
    $scope.cardIndex    = 0;
    $scope.currentCard  = {};
    $scope.flipped      = false;
    $scope.isComplete   = false;
    $scope.isChallenger = $routeParams.isChallenger;
    $scope.timer        = 30; //default starting for timer
    $scope.overallScore = 0;
    $scope.isChalMode   = true;
    $scope.progress     = {complete: 0, wrong: 0, correct: 0, deckSize: 0, timeScore: 0};


    Deck.quiz($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
      $scope.isOwner = Deck.checkIfOwner($scope.deck.ownerId, $scope.currentUser._id);
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      $scope.progress.deckSize = $scope.deck.cards.length;
    });

    $scope.$on('complete', function(){
      $scope.deck.progress = $scope.progress;
      $scope.overallScore = Challenge.calcScore($scope.progress);
      if($scope.isChallenger === 'true'){
        //create the challenge
        $scope.issueChallenge($scope.overallScore);
      }else{
        //finish the challenge
        $scope.completeChallenge($scope.overallScore);
      }
    });

    //interval timer
    var interval = $interval(setTimer, 1000);

    $scope.answer = function(choice){
      if(choice === $scope.currentCard.answer){
        $scope.progress.correct++;
        $scope.progress.timeScore += $scope.timer;
      }else{
        $scope.progress.wrong++;
      }

      $scope.progress.complete++;
      $scope.timer = 30;
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

    $scope.issueChallenge = function(score){
      Deck.challenge($scope.deck.ownerId, $scope.currentUser._id, $scope.deck._id, score).then(function(res){
        toastr.success('Challenge has been sent!');
      });
    };

    $scope.completeChallenge = function(score){
      Challenge.complete(score, $routeParams.challengeId).then(function(res){
        toastr.success('You\'ve completed the challenge');
      });
    };

    $scope.goToDashboard = function(){
      $location.path('/user-home');
    };

    $scope.rateDeck = function(direction, deckId){
      Deck.rateDeck(direction, deckId).then(function(res){
        toastr.success('Thank you for the rating!');
        $scope.goToDashboard();
      });
    };

    //HELPER
    function setTimer(){
      $scope.timer--;
      $scope.redZone = $scope.timer < 6;
      if($scope.timer === 0){
        $scope.answer('--');
        $scope.redZone = false;
      }
      else if($scope.isComplete){
        $interval.cancel(interval);
      }
    }


  }]);
})();
