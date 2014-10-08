(function(){
  'use strict';

  var browse = angular.module('knipit');

  browse.controller('BrowseCtrl', ['$scope', '$location', 'Deck', function($scope, $location, Deck){

    var searchResults = $('#searchResults');
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

      searchResults.isotope({
        itemSelector: '.result',
        layoutMode: 'masonry',
        filter: queries[0]
      });
    };


  }]);



})();
