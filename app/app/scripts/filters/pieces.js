'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:pieces
 * @function
 * @description
 * # pieces
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('pieces', function ($filter) {
    return function (input) {
      if(parseInt(input) > 1) {
        return input + '&nbsp;' + $filter('translate')('pieces');
      } else if(parseInt(input) === 1) {
        return input + '&nbsp;' + $filter('translate')('piece');
      } else if(parseInt(input) === 0) {
        return '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;' + input;
      } else {
        return '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;' + input;
      }
    };
  });
