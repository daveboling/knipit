(function(){
  'use strict';

  var userHome = angular.module('knipit');

  //CONTROLLER
  userHome.controller('UserHomeCtrl', ['$scope', 'LocalUser', function($scope, LocalUser){
    $scope.title = 'User-Page';
    $scope.deck = {};
    $scope.decks = [];

    function fail(){
      toastr.error('You have failed me for the last time.');
    }


    $scope.createDeck = function(){
      LocalUser.createDeck($scope.deck).then(function(res){
        $scope.decks.push(res.data.deck);
      }, fail);
    };
  }]);

  //FACTORY
  userHome.factory('LocalUser', ['$http', function($http){

    function createDeck(deck){
      return $http.post('/deck/create', deck);
    }

    return {createDeck: createDeck};
  }]);



//line end
})();
