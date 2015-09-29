import angular from 'angular';

angular.module('app', [])
  .controller('main', ['$scope', function($scope) {
    console.log('Hello from angular, add more text');
  }]);
