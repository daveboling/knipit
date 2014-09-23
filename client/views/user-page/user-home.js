(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$location', 'Deck', function($scope, $location, Deck){
    $scope.title = 'User-Page';
    $scope.deck = {};
    $scope.decks = [];


    function fail(){
      toastr.error('Something went wrong.');
    }

    //Display all logged in user's decks
    Deck.getDecks().then(function(res){
      $scope.decks = res.data.decks || [];
    }, fail);


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
