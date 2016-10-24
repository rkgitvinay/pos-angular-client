'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:deviceHealth
 * @description
 * # deviceHealth
 */
angular.module('iklinikPosApp')
  .directive('deviceHealth', function ($filter) {
    return {
      templateUrl: 'views/directives/deviceHealth.directives.html',
      replace: true,
      scope: {
        deviceHealth: '='
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.selectionWaterImapct = [
          {value: $filter('translate')('yes')},
          {value: $filter('translate')('no')}
        ];

        scope.selectionImpact = [
          {value: $filter('translate')('yes')},
          {value: $filter('translate')('no')},
          {value: $filter('translate')('partial')}
        ];

        scope.selectionExternalImpact = [
          {value: $filter('translate')('yes')},
          {value: $filter('translate')('no')}
        ];
      }
    };
  });
