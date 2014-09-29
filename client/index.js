(function(){
  'use strict';

  angular.module('knipit', ['ngRoute', ,'ngAnimate', 'LocalForageModule'])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .config(['$routeProvider', '$httpProvider', '$localForageProvider', function($routeProvider, $httpProvider, $localForageProvider){
    $routeProvider
    .when('/', {templateUrl:'/views/home/home.html', controller:'HomeCtrl'})
    .when('/register', {templateUrl:'/views/register/register.html', controller:'RegisterCtrl'})
    .when('/login', {templateUrl:'/views/login/login.html', controller:'LoginCtrl'})
    .when('/logout', {templateUrl:'/views/logout/logout.html', controller:'LogoutCtrl'})
    .when('/user-home', {templateUrl:'/views/user-page/user-home.html', controller:'UserHomeCtrl'})
    .when('/deck/:deckId/view', {templateUrl:'/views/deck/deck.html', controller:'DeckCtrl'})
    .when('/flip/:deckId', {templateUrl:'/views/flip/flip.html', controller:'FlipCtrl'})
    .when('/quiz/:deckId', {templateUrl:'/views/quiz/quiz.html', controller:'QuizCtrl'})
    .when('/browse', {templateUrl:'/views/browse/browse.html', controller:'BrowseCtrl'})
    .otherwise({redirectTo:'/'});

    $httpProvider.interceptors.push('HttpInterceptor');
    $localForageProvider.config({name:'knipit', storeName:'cache', version:1.0});
  }]);
})();

