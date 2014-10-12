(function(){
  'use strict';

  angular.module('knipit')
  .factory('User', ['$http', function($http){

    function register(user){
      return $http.post('/register', user);
    }

    function login(user){
      return $http.post('/login', user);
    }

    function logout(){
      return $http.delete('/logout');
    }

    function checkSession(){
      return $http.get('/checkSession');
    }

    function getOwner(ownerId){
      return $http.get('/getOwner/'+ownerId);
    }

    function getCurrentLeaders(){
      return $http.get('/getLeaders');
    }


    return {register:register, login:login, logout:logout, checkSession: checkSession, getOwner: getOwner, getCurrentLeaders: getCurrentLeaders};
  }]);
})();

