'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:repair
 * @function
 * @description
 * # repair
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('repair', function () {
    var numberLength = 8;

    return function (input) {
      if(input !== undefined) {
        input = input.toString();
        var length = input.length;
        var number = input;

        var i = numberLength-length;
        while(i>0) {
          number = '0' + number;
          i--;
        }

        return 'R' + number;
      } else {
        return input;
      }
    };
  });
