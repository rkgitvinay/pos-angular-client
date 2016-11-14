'use strict';

/**
 * @ngdoc filter
 * @name posIklinikClientApp.filter:repair
 * @function
 * @description
 * # repair
 * Filter in the posIklinikClientApp.
 */
angular.module('posIklinikClientApp')
  .filter('quote', function () {
    return function (input) {
      return 'quote filter: ' + input;
    };
  });
