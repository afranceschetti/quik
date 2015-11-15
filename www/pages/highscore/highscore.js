'use strict';

angular.module('quik.highscore', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/highscore', {
		templateUrl : 'pages/highscore/highscore.html',
		controller : 'HighscoreCtrl'
	});
} ])

.controller(
		'HighscoreCtrl',
		[
			'$scope','localStorageService', '$location',
			function($scope,localStorageService,$location) {
				$('html,body').animate({scrollTop : 0}, 500);
				var allPlayers = Helpers.util.readFromLocalStore(localStorageService, "allPlayers", []);
				$scope.playersByScoreSimple = [];
				$scope.playersByScorePotions = [];
				$scope.playersByScoreSpeed = [];
				$scope.playersByShot = [];

				$scope.goToHome = function () { $location.path('home'); }

				if(allPlayers!=null){
					console.log("allPlayers.lenght", allPlayers.length);
					for(var i=0; i<allPlayers.length; i++){
						console.log("allPlayers[i]", allPlayers[i]);
						var player = 
							{ 
								name: allPlayers[i],
								totalScoreSimple: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScoresimple" + allPlayers[i], "0"),
								totalScorePotions: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScorepotions" + allPlayers[i], "0"),
								totalScoreSpeed: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScorespeed" + allPlayers[i], "0"),
								totalScoreDateSimple: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScoreDatesimple" + allPlayers[i], "0"),
								totalScoreDatePotions: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScoreDatepotions" + allPlayers[i], "0"),
								totalScoreDateSpeed: Helpers.util.readFromLocalStore(localStorageService, "recordTotalScoreDatespeed" + allPlayers[i], "0"),
								singleShot: Helpers.util.readFromLocalStore(localStorageService, "recordSingleShot" + allPlayers[i], "0"),
								singleShotDate: Helpers.util.readFromLocalStore(localStorageService, "recordSingleShotDate" + allPlayers[i], "0"),
							};		
						$scope.playersByScoreSimple.push(player);	
						$scope.playersByScorePotions.push(player);	
						$scope.playersByScoreSpeed.push(player);	
						$scope.playersByShot.push(player);	
					}
				}
				$scope.playersByScoreSimple.sort(Helpers.util.sortBy('totalScoreSimple', true));
				$scope.playersByScorePotions.sort(Helpers.util.sortBy('totalScorePotions', true));
				$scope.playersByScoreSpeed.sort(Helpers.util.sortBy('totalScoreSpeed', true));
				$scope.playersByShot.sort( Helpers.util.sortBy('singleShot', false));
				$scope.showStatistic = function(player){
					console.log("player", player);
					Helpers.util.writeToLocalStore(localStorageService, "currentPlayer",player);						
					$location.path('player');

				};
			} 
		]);