'use strict';

angular.module('quik.help', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/help', {
    templateUrl: 'pages/help/help.html',
    controller: 'HelpCtrl'
  });
}])

.controller('HelpCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.goToHome = function () { $location.path('home'); }
}]);