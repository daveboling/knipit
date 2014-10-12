(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$location', 'Deck', 'Challenge', 'History', function($scope, $location, Deck, Challenge, History){
    $scope.deck               = {};
    $scope.decks              = [];
    $scope.challenges         = [];
    $scope.history            = [];
    $scope.categoryToFilter   = '';
    var decks                 = $('#deckContainer');


    function fail(){
      toastr.error('Something went wrong.');
    }

    //Display all logged in user's decks
    Deck.getDecks().then(function(res){
      $scope.decks = res.data.decks || [];
    }, fail);

    //Display challenge history
    History.getHistory($scope.currentUser._id).then(function(res){
      $scope.history = res.data.history;
    });

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
      //check to see if input correct
      if(!$scope.deck.name || !$scope.deck.category){
        toastr.error('Silly goose. You forgot something!');
        return;
      }

      Deck.createDeck($scope.deck).then(function(res){
        $scope.decks.push(res.data.deck);
        $scope.deck = {};
        $scope.new = false;
      }, fail);
    };

    $scope.selectDeck = function(deckId){
      $location.path('/deck/'+deckId+'/view');
    };

    $scope.accept = function(challenge){
      toastr.success('Challenged accepted.');
      $location.path('/challenge/' + challenge.deckId +'/' + false +'/'+challenge._id);
    };

    $scope.decline = function(deckId){
      Challenge.declineChallenge(deckId).then(function(res){
        toastr.success('Challenge declined.');
        $scope.getChallenges();
      });
    };

    //isotope
    $scope.filterResults = function(){
      var filter =  $scope.categoryToFilter || '',
      queries = filter.split(' ');

      queries.forEach(function(word, index){
        //checking to see if global character has been picked
        if(word !== '*'){
          queries[index] = '.' + word;
        }
      });

      decks.isotope({
        itemSelector: '.deck',
        layoutMode: 'masonry',
        filter: queries[0]
      });
    };

  }]);

//module end
})();
