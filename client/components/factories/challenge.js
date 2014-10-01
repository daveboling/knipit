(function(){
  'use strict';

  var challenge = angular.module('knipit');

  challenge.factory('Challenge', ['$http', function($http){

    //get challenges for specific user
    function getChallenges(){
      return $http.get('/challenges/all');
    }

    //accept challenge
    function acceptChallenge(challengeId){
      return $http.post('/challenge/accept/'+challengeId);
    }

    //decline challenge
    function declineChallenge(challengeId){
      return $http.delete('/challenge/decline/'+challengeId);
    }

    //complete challenge (save)
    function complete(score, challengeId){
      return $http.post('/challenge/complete/'+challengeId, {score: score});
    }

    //HELPER FUNCTIONS
    function calcScore(progress){
      return (progress.correct * 5) + progress.timeScore;
    }



    return {
      getChallenges:    getChallenges,
      acceptChallenge:  acceptChallenge,
      declineChallenge: declineChallenge,
      calcScore:        calcScore,
      complete:         complete
    };
  }]);
})();
