(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$location', 'Deck', 'Challenge', function($scope, $location, Deck, Challenge){
    $scope.title              = 'User-Page';
    $scope.deck               = {};
    $scope.decks              = [];
    $scope.challenges         = [];
    $scope.sendChallenges     = [];
    $scope.receivedChallenges = [];


    function fail(){
      toastr.error('Something went wrong.');
    }

    //Display all logged in user's decks
    Deck.getDecks().then(function(res){
      $scope.decks = res.data.decks || [];
    }, fail);

    //Display list of current challenges
    $scope.getChallenges = function(){
      Challenge.getChallenges().then(function(res){
        $scope.challenges = res.data.challenges;
      });
    };

    //initial page load
    $scope.getChallenges();

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

    $scope.accept = function(deckId){
      toastr.success('Challenged accepted.');
      $location.path('/challenge/' + deckId +'/' + false);
    };

    $scope.decline = function(deckId){
      Challenge.declineChallenge(deckId).then(function(res){
        toastr.success('Challenge declined.');
        $scope.getChallenges();
      });
    };

  }]);


//module end
})();
