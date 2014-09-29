(function(){
  'use strict';

  angular.module('knipit')
  .controller('NavCtrl', ['$scope', '$localForage', 'User', function($scope, $localForage, User){
    /*
      If a user is refreshing the browser, why not go ahead and check their server session
      and reflect this data on client side since they're already making a request? If logout
      is clicked, the session is still destroyed and since a global $scope variable is being
      used(appController.js), we can reflect this change on the client side upon logout. This way,
      the currentUser will always be persistent as long as the server side session is persisent or
      hasn't expired.

      As as additional form of authentication, I'm going to hangon to the $http-interceptor and am
      keeping the headers the same.
    */

    //check server session in initial load
    User.checkSession().then(function(res){
      //this is for checking browser refreshes and maintaining the user's session client side
      $scope.setCurrentUser(res.data.user);
    });

    $localForage.getItem('email').then(function(email){
      $scope.email = email;
    });

    $scope.$on('authenticated', function(event, email){
      if(email === 'anonymous'){email = null;}

      $localForage.setItem('email', email).then(function(){
        $scope.email = email;
      });
    });
  }]);
})();

