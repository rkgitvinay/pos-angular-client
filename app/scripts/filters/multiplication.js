'use strict';

/**
 * @ngdoc filter
 * @name posIklinikClientApp.filter:multiplication
 * @function
 * @description
 * # multiplication
 * Filter in the posIklinikClientApp.
 */
angular.module('posIklinikClientApp')
  .filter('multiplication', function () {
    return function (input) {
      return 'multiplication filter: ' + input;
    };
  });
