'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:notes
 * @description
 * # notes
 */
angular.module('iklinikPosApp')
  .directive('notes', function ($filter) {
    return {
      templateUrl: 'views/directives/notes.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        notes: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.tabs = [
          {
            name: $filter('translate')('internal'),
            isActive: true
          },
          {
            name: $filter('translate')('external'),
            isActive: false
          }
        ];

        scope.toggle = function() {
          if(scope.tabs[0].isActive) {
            scope.tabs[0].isActive = false;
            scope.tabs[1].isActive = true;
          } else {
            scope.tabs[1].isActive = false;
            scope.tabs[0].isActive = true;
          }
        }
      }
    };
  });
