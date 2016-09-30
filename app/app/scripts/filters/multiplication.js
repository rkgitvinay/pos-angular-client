'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:multiplication
 * @function
 * @description
 * # multiplication
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('multiplication', function ($filter) {
    return function (factor_1, factor_2) {
      var int_factor_1 = parseInt(factor_1);
      var int_factor_2 = parseInt(factor_2);

      var product = int_factor_1 * int_factor_2;
      return $filter('number')(product, 2);
    };
  });
