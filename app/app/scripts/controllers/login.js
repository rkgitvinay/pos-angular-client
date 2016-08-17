'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('LoginCtrl', function ($scope, AuthService) {

    $scope.submit = function() {
      return AuthService.authenticate('test', 'test');
    }
  });
