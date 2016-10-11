'use strict';

/**
 * @ngdoc directive
 * @name posIklinikClientApp.directive:smartphoneSelection
 * @description
 * # smartphoneSelection
 */
angular.module('posIklinikClientApp')
  .directive('smartphoneSelection', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the smartphoneSelection directive');
      }
    };
  });
