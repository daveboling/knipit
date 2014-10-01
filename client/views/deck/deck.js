(function(){
  'use strict';

  var deck = angular.module('knipit');

  deck.controller('DeckCtrl', ['$scope', '$routeParams', '$location', 'Deck', 'User', function($scope, $routeParams, $location, Deck, User){
    $scope.editMode    = false;
    $scope.deck        = {};
    $scope.showModal   = false;

    //inital deck load
    Deck.selectDeck($routeParams.deckId).then(function(res){
      $scope.deck = res.data.deck;

      //opted not to do this server side, at least for the time being
      User.getOwner($scope.deck.ownerId).then(function(res){
        $scope.deck.owner = res.data.owner;
      });

      //check if the owner is viewing their own deck
      $scope.isOwner = Deck.checkIfOwner($scope.deck.ownerId, $scope.currentUser._id);
    });

    $scope.editDeck = function(){
      $scope.editMode = true;
    };

    $scope.saveDeck = function(){
      //remove empty cards
      $scope.deck.cards = Deck.removeEmptyCards($scope.deck.cards);

      //save edited deck
      Deck.save($scope.deck).then(function(res){
        $scope.editMode = false;
      });
    };

    //enter key is pressed on the last answer input
    $scope.enterAddCard = function(e, last){
      if(e.keyCode === 13 && last){
        $scope.deck.cards.push({question: '', answer: ''});
        $(this).next().focus();
      }
    };

    //general add card button
    $scope.addCard = function(){
      $scope.deck.cards.push({question: '', answer: ''});
    };

    $scope.flip = function(){
      $location.path('/flip/' + $scope.deck._id);
    };

    $scope.quiz = function(){
      $location.path('/quiz/' + $scope.deck._id);
    };

    $scope.challengeMode = function(){
      $location.path('/challenge/' + $scope.deck._id + '/' + true + '/' + 'noid');
    };

    $scope.deleteDeck = function(){
      Deck.deleteDeck($scope.deck._id).then(function(res){
        $location.path('/user-home');
        toastr.error('Deck deleted.');
      });
    };

    $scope.deleteModal = function(){
      $scope.showModal = !$scope.showModal;
    };


  }]);

})();
