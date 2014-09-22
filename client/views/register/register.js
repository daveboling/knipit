(function(){
  'use strict';

  angular.module('knipit')
  .controller('RegisterCtrl', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.user = {};
    $scope.matched = false;

    function success(response){
      toastr.success('Welcome.');
      $location.path('/login');
    }

    function failure(response){
      toastr.error('Sorry, either that e-mail was already registered or an error occured. Try again.');
      $scope.user = {};
    }

    $scope.register = function(){
      if($scope.matched === false){
        toastr.error('Your passwords do not match, please try again.');
      }else{
        User.register($scope.user).then(success, failure);
      }
    };

    $scope.checkPass = function(){
      $scope.matched = $scope.user.password === $scope.user.passwordConfirm;
    };

  }]);
})();

