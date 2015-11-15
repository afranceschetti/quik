'use strict';

angular.module('quik.home', [ 'ngRoute' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl : 'pages/home/home.html',
		controller : 'HomeCtrl'
	});
} ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/choose-player', {
		templateUrl : 'pages/home/choose-player.html',
		controller : 'HomeCtrl'
	});
} ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/info', {
		templateUrl : 'pages/home/info.html',
		controller : 'HomeCtrl'
	});
} ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/about', {
		templateUrl : 'pages/home/about.html',
		controller : 'HomeCtrl'
	});
} ])
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/setting', {
		templateUrl : 'pages/home/setting.html',
		controller : 'HomeCtrl'
	});
} ])
.controller(
		'HomeCtrl',
		[
			'$scope','localStorageService', '$location', '$translate',
			function($scope,localStorageService,$location, $translate) {

				$scope.showChoosePlayer = false;


				$scope.allPlayers =  Helpers.util.readFromLocalStore(localStorageService, "allPlayers", []);
				$scope.currentPlayer = Helpers.util.readFromLocalStore(localStorageService, "currentPlayer", "Guest");

				$scope.choosePlayer = function(){
					$scope.showChoosePlayer = true;
					var top = $('#choose-player-name-panel').offset().top +500;
					$('html,body').animate({scrollTop : top}, 500);
				};
				
				
				$scope.gameType = Helpers.util.readFromLocalStore(localStorageService, "gameType", "simple");

				
				$scope.chooseGameType = function(gameType){
					$scope.gameType = gameType;
					Helpers.util.writeToLocalStore(localStorageService, "gameType",gameType);						
				}
				
				$scope.addPlayer = function(){
					console.log("player", $scope.currentPlayer);
					if($scope.currentPlayer!=null && $scope.currentPlayer!='' && $scope.allPlayers.indexOf($scope.currentPlayer) == -1) {
						$scope.allPlayers.push($scope.currentPlayer);
						Helpers.util.writeToLocalStore(localStorageService, "allPlayers",JSON.stringify($scope.allPlayers));						
					}
					
						
					$scope.startGame($scope.currentPlayer);
					
				};
				$scope.goToChoosePlayer = function () { $location.path('choose-player'); }
				$scope.goToAbout = function () { $location.path('about'); }
				$scope.goToInfo = function () { $location.path('info'); }
				$scope.goToSetting = function () { $location.path('setting'); }
				$scope.goToHome = function () { $location.path('home'); }

				$scope.startGame = function (player) {
					Helpers.util.writeToLocalStore(localStorageService, "currentPlayer",player);						
					$location.path('game');
					
				};
				$scope.changeLanguage = function(langKey) {
					$translate.use(langKey);
				};
				
			} 
			
		])
		.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });