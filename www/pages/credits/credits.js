'use strict';

angular.module('quik.credits', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/credits', {
    templateUrl: 'pages/credits/credits.html',
    controller: 'CreditsCtrl'
  });
}])

.controller('CreditsCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.goToHome = function () { $location.path('home'); }
}]);