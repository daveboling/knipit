(function(){
  'use strict';

  angular.module('knipit')
  .controller('LoginCtrl', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.user = {};

    function success(response){
      toastr.success('Welcome.');
      $location.path('/');
    }

    function failure(response){
      toastr.error('Username or password incorrect, please try again.');
      $scope.user = {};
    }

    $scope.login = function(){
      User.login($scope.user).then(success, failure);
    };
  }]);
})();

