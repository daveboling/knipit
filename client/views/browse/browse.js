(function(){
  'use strict';

  var browse = angular.module('knipit');

  browse.controller('BrowseCtrl', ['$scope', '$location', 'Deck', function($scope, $location, Deck){

    $scope.search = {};

  }]);



})();
