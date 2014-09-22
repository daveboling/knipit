(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', 'LocalUser', function($scope, LocalUser){
    $scope.title = 'User-Page';
    $scope.deck = {};
    $scope.decks = [];


    $scope.createDeck = function(){
      LocalUser.createDeck($scope.deck).then(function(res){
        $scope.decks.push(res.data.deck);
      });
    };
  }]);







  //FACTORY
  userHome.factory('LocalUser', ['$scope', '$http', function($scope, $http){

    function createDeck(deck){
      $http.post('/deck/create', deck);
    }

    return {createDeck: createDeck};
  }]);



//line end
})();
