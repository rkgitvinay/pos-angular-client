'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:OrderctrlCtrl
 * @description
 * # OrderctrlCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('OrderCtrl', function ($scope, ProductGroups) {
    $scope.products = {selection: [], selected: []};
    $scope.customer = {selected: {}};

    ProductGroups.get().then(function(result) {
      $scope.productGroups = result;
    });
  });
