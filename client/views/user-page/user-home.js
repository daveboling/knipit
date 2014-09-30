(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$location', 'Deck', 'Challenge', function($scope, $location, Deck, Challenge){
    $scope.title      = 'User-Page';
    $scope.deck       = {};
    $scope.decks      = [];
    $scope.challenges = [];


    function fail(){
      toastr.error('Something went wrong.');
    }

    //Display all logged in user's decks
    Deck.getDecks().then(function(res){
      $scope.decks = res.data.decks || [];
    }, fail);

    //Display list of current challenges
    Challenge.getChallenges().then(function(res){
      console.log(res.data);
      $scope.challenges = res.data.challenges;
    });

    //create a new deck and return the newly created deck w/ deck id
    $scope.createDeck = function(){
      Deck.createDeck($scope.deck).then(function(res){
        $scope.decks.push(res.data.deck);
        $scope.deck = {};
        $scope.new = false;
      }, fail);
    };

    $scope.selectDeck = function(deckId){
      $location.path('/deck/'+deckId+'/view');
    };

  }]);


//module end
})();
