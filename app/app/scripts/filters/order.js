'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:order
 * @function
 * @description
 * # order
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('order', function () {
    var numberLength = 8;

    return function (input) {
      var input = input.toString();
      var length = input.length;
      var number = input;

      var i = numberLength-length;
      while(i>0) {
        number = '0' + number;
        i--;
      }

      return 'O' + number;
    };
  });
