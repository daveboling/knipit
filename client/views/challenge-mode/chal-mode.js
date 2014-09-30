(function(){
  'use strict';

  var chalMode = angular.module('knipit');

  chalMode.controller('ChallengeCtrl', ['$scope', '$routeParams', '$location', '$interval', 'Deck', 'Challenge', function($scope, $routeParams, $location, $interval, Deck, Challenge){
    $scope.deck         = {};
    $scope.cardIndex    = 0;
    $scope.currentCard  = {};
    $scope.flipped      = false;
    $scope.isComplete   = false;
    $scope.isChallenger = true;
    $scope.timer        = 30; //default starting for timer
    $scope.overallScore = 0;
    $scope.progress     = {complete: 0, wrong: 0, correct: 0, deckSize: 0, timeScore: 0};

    Deck.quiz($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;
      $scope.currentCard = $scope.deck.cards[$scope.cardIndex];
      $scope.isOwner = Deck.checkIfOwner($scope.deck.ownerId, $scope.currentUser._id);
      $scope.progress.deckSize = $scope.deck.cards.length;
    });

    $scope.$on('complete', function(){
      $scope.deck.progress = $scope.progress;
      $scope.overallScore = Challenge.calcScore($scope.progress);
      if($scope.isChallenger){
        //create the challenge
        $scope.issueChallenge($scope.overallScore);
      }else{
        //finish the challenge
        console.log('completed');
      }
    });

    //timer
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
        toastr.success($scope.deck.owner.username+' has been challenged!');
      });
    };

    //this may need to be moved elsewhere
    $scope.takeChallenge = function(){
      $scope.isChallenger = false;
    };

    $scope.goToDashboard = function(){
      $location.path('/user-home');
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
