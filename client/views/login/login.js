(function(){
  'use strict';

  angular.module('knipit')
  .controller('LoginCtrl', ['$scope', '$location', '$rootScope', 'User' , 'AUTH_EVENTS', function($scope, $location, $rootScope, User, AUTH_EVENTS){
    $scope.user = {};

    function successLogin(response){
      toastr.success('Login successful!');
      //broadcast success to all children - possibly use later
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(response.data.user);
      $location.path('/');
    }

    function failureLogin(response){
      toastr.error('Username or password incorrect, please try again.');
      //broadcast failure to all children - possibly use later
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.user = {};
    }

    $scope.login = function(){
      User.login($scope.user).then(successLogin, failureLogin);
    };

  }]);
})();
