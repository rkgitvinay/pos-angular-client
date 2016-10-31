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
  .filter('repair', function () {
    return function (input) {
      return 'repair filter: ' + input;
    };
  });
