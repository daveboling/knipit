(function(){
  'use strict';

  var history = angular.module('knipit');

  history.factory('History', ['$http', function($http){

    function getHistory(currentUserId){
      return $http.get('/history/all');
    }

    return {
      getHistory:    getHistory
    };
  }]);
})();

