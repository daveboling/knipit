(function(){
  'use strict';

  var browse = angular.module('knipit');

  browse.controller('BrowseCtrl', ['$scope', '$location', 'Deck', function($scope, $location, Deck){

    $scope.search = {};
    $scope.results = [];

    $scope.search = function(){
      Deck.searchDecks($scope.search.query, 'all').then(function(res){
        $scope.results = res.data.results;
        $scope.search.query = '';
      });
    };

    $scope.viewPublicDeck = function(deckId){
      $location.path('/deck/'+deckId+'/view');
    };

  }]);



})();
