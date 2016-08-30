'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('ModalCtrl', function ($scope, close) {

    $scope.dismissModal = function(result) {
      close(result, 200); // close, but give 200ms for bootstrap to animate
    };
  });
