'use strict';

angular.module('quik.player', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/player', {
		templateUrl : 'pages/player/player.html',
		controller : 'PlayerCtrl'
	});
} ])

.controller(
		'PlayerCtrl',
		[
			'$scope','localStorageService', '$location',
			function($scope,localStorageService,$location) {
				
				$('html,body').animate({scrollTop : 0}, 500);
				
				$scope.goToHome = function () { $location.path('home'); }

				$scope.requestDelete = false;
				
				$scope.currentPlayer = Helpers.util.readFromLocalStore(localStorageService, "currentPlayer", "Guest");
				console.log(Helpers.util.readFromLocalStore(localStorageService, "recordTotalScore" + $scope.currentPlayer, "-"));
				$scope.recordTotalScore = Helpers.util.readFromLocalStore(localStorageService, "recordTotalScore" + $scope.currentPlayer, "-");
				$scope.recordTotalScoreDate = Helpers.util.readFromLocalStore(localStorageService, "recordTotalScoreDate" + $scope.currentPlayer, "-");
				$scope.recordSingleShot = Helpers.util.readFromLocalStore(localStorageService, "recordSingleShot" + $scope.currentPlayer, "-");
				$scope.recordSingleShotDate = Helpers.util.readFromLocalStore(localStorageService, "recordSingleShotDate" + $scope.currentPlayer, "-");
				
				$scope.statisticTotalGamesSimple = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalGamessimple" + $scope.currentPlayer, 0);
				$scope.statisticTotalGamesPotions = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalGamespotions" + $scope.currentPlayer, 0);
				$scope.statisticTotalGamesSpeed = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalGamesspeed" + $scope.currentPlayer, 0);
				
				$scope.statisticTotalGames = $scope.statisticTotalGamesSimple + $scope.statisticTotalGamesPotions +$scope.statisticTotalGamesSpeed;
				
				$scope.statisticTotalTimes = Helpers.util.covertTimeToElapsed(Helpers.util.readFromLocalStore(localStorageService, "statisticTotalTimes" + $scope.currentPlayer, 0));
				$scope.statisticTotalError = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalError" + $scope.currentPlayer, 0);
				
				$scope.statisticTotalExpiredSimple = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalExpiredsimple" + $scope.currentPlayer, 0);
				$scope.statisticTotalExpiredPotions = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalExpiredpotions" + $scope.currentPlayer, 0);
				$scope.statisticTotalExpiredSpeed = Helpers.util.readFromLocalStore(localStorageService, "statisticTotalExpiredspeed" + $scope.currentPlayer, 0);

				$scope.statisticTotalExpired = $scope.statisticTotalExpiredSimple + $scope.statisticTotalExpiredPotions +$scope.statisticTotalExpiredSpeed;

				$scope.statisticLastGame = new Date(Helpers.util.readFromLocalStore(localStorageService, "statisticLastGame" + $scope.currentPlayer, "-"));
				
				
				$scope.allTropheis = [];
				var wonTropheis = Helpers.util.readFromLocalStore(localStorageService, "wonTropheis" + $scope.currentPlayer, []);

				for(var int=0; int<Constants.tropheis.length; int++){
					var obtainedTrophy = wonTropheis.indexOf(Constants.tropheis[int])==-1?false: true;
					$scope.allTropheis.push({name: Constants.tropheis[int], obtained: obtainedTrophy});
				}

				$scope.requestDeletePlayer = function(){
					$scope.requestDelete = true;
				};
				
				$scope.deletePlayer = function(){
					Helpers.util.removeFromLocalStore(localStorageService, "currentPlayer");
					Helpers.util.removeFromLocalStore(localStorageService, "recordTotalScore" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "recordSingleShot" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "statisticTotalGames" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "statisticTotalTimes" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "statisticTotalError" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "statisticTotalExpired" + $scope.currentPlayer);
					Helpers.util.removeFromLocalStore(localStorageService, "statisticLastGame" + $scope.currentPlayer);
					
					var allPlayers =  Helpers.util.readFromLocalStore(localStorageService, "allPlayers", []);
					var index = allPlayers.indexOf($scope.currentPlayer);
					allPlayers.splice(index, 1);
					Helpers.util.writeToLocalStore(localStorageService, "allPlayers",JSON.stringify(allPlayers));						
					$location.path('home');
				};
				
			
			} 
		]);