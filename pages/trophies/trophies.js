'use strict';

angular.module('quik.trophies', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trophies', {
    templateUrl: 'pages/trophies/trophies.html',
    controller: 'TrophiesCtrl'
  });
}]).controller('TrophiesCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.goToHome = function () { $location.path('home'); }
}]);