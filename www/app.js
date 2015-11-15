'use strict';

// Declare app level module which depends on views, and components
angular.module('quik', [
  'ngRoute',
  'quik.home',
  'quik.game',
  'quik.player',
  'quik.highscore', 
  'quik.credits',
  'quik.trophies',
  'quik.help',
  'quik.version',
  'timer', 
  'LocalStorageModule',
  'pascalprecht.translate',
  'ngSanitize',
  'ngTouch'
])
.config(['$routeProvider', '$compileProvider', function($routeProvider,$compileProvider) {
	$compileProvider.imgSrcSanitizationWhitelist('images/');
	$routeProvider.otherwise({redirectTo: '/home'});
}])
.config(['$translateProvider', function ($translateProvider) {
	$translateProvider
	.translations('en', translations_en)
	.translations('it', translations_it)
	.preferredLanguage('en');
}])
.controller('FooterCtrl', ['$scope', '$translate', function($scope,$translate) {
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
}]);


	
	
