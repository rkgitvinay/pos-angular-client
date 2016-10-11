'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:currency
 * @function
 * @description
 * # currency
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('countryCurrency', function (BranchService, $filter) {
    return function (input) {
      var result = BranchService.readSelectedBranch();

      return $filter('currency')(input,result.currency+' ', 2)
    };
  })

  .filter('getCurrency', function (BranchService, $filter) {
    return function (input) {
      var result = BranchService.readSelectedBranch();

      return result.currency;
    };
  });
