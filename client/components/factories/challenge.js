(function(){
  'use strict';

  var challenge = angular.module('knipit');

  challenge.factory('Challenge', ['$http', function($http){

    //get challenges for specific user
    function getChallenges(){
      return $http.get('/challenges/all');
    }

    //accept challenge

    //decline challenge

    return {getChallenges: getChallenges};
  }]);
})();
