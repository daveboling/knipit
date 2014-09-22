(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', '$rootScope', 'LocalUser', function($scope, $rootScope, LocalUser){
    $scope.title = 'User-Page';
    $scope.deck = {};
    $scope.decks = [];

    console.log($rootScope.user.email || 'No email');

    function fail(){
      toastr.error('Something went wrong.');
    }

    $scope.getDecks = function(){
      LocalUser.getDecks($rootScope.user.email).then(function(res){
        $scope.decks = res.data.decks;
      }, fail);
    };

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

    function getDecks(email){
      return $http.get('/decks/localuser/' + email);
    }

    return {createDeck: createDeck, getDecks: getDecks};
  }]);



//module end
})();
