(function(){
  'use strict';

  angular.module('knipit')
  .controller('RegisterCtrl', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.user = {};
    $scope.matched = false;
    $scope.validName = false;

    function success(response){
      toastr.success('Registration successful!');
      $location.path('/login');
    }

    function failure(response){
      toastr.error('Sorry, either that e-mail was already registered or an error occured. Try again.');
      $scope.user = {};
    }

    $scope.register = function(){
      if(!$scope.matched){
        toastr.error('Passwords do not match, please try again.');
      }else if(!$scope.validName){
        toastr.error('Username must be greater than 5 characters.');
      }else{
        User.register($scope.user).then(success, failure);
      }
    };

    $scope.checkPass = function(){
      $scope.matched = $scope.user.password === $scope.user.passwordConfirm;
    };

    $scope.nameLength = function(){
      $scope.validName = (!$scope.user.username) ? false : true;
    };

  }]);
})();

