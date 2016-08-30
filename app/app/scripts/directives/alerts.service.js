/**
 * Created by robinengbersen on 29.08.16.
 */
'use strict';

/**
 *
 * $scope.alerts.push({type: 'danger', message: $filter('translate')('serverError')});
 */
angular.module('iklinikPosApp')
  .directive('alerts', [function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/directives/alerts.directives.html',
        scope: {
          alerts: '='
        },
        link: function (scope) {
          scope.$watch('alerts', function(value) {
            scope.alerts = value;
          });
        }

      };
    }]
  );
