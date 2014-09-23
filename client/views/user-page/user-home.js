(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$rootScope', 'LocalUser', function($scope, $rootScope, LocalUser){
    $scope.title = 'User-Page';
    $scope.deck = {};
    $scope.decks = [];


    function fail(){
      toastr.error('Something went wrong.');
    }

    //Display all logged in user's decks
    LocalUser.getDecks().then(function(res){
      $scope.decks = res.data.decks || [];
    }, fail);


    //create a new deck and return the newly created deck w/ deck id
    $scope.createDeck = function(){
      LocalUser.createDeck($scope.deck).then(function(res){
        $scope.decks.push(res.data.deck);
        $scope.deck = {};
        $scope.new = false;
      }, fail);
    };

    //start flip

    //start quiz

    //edit deck

    //delete deck
  }]);



  //FACTORY
  userHome.factory('LocalUser', ['$http', function($http){

    function createDeck(deck){
      return $http.post('/deck/create', deck);
    }

    function getDecks(){
      return $http.get('/decks/all/');
    }

    return {createDeck: createDeck, getDecks: getDecks};
  }]);



//module end
})();
