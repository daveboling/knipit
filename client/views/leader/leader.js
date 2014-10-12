(function(){
  'use strict';

  var board = angular.module('knipit');

  board.controller('LeaderCtrl', ['$scope', 'User', function($scope, User){
    $scope.winLeaders   = [];
    $scope.scoreLeaders = [];

    User.getCurrentLeaders().then(function(res){
      $scope.winLeaders   = res.data.winLeaders;
      $scope.scoreLeaders = res.data.scoreLeaders;
    });

  }]);
})();
