'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:selectPaymentMethod
 * @description
 * # selectPaymentMethod
 */
angular.module('iklinikPosApp')
  .directive('selectPaymentMethod', function () {
    return {
      templateUrl: 'views/directives/selectPaymentMethod.directives.html',
      restrict: 'E',
      scope: {
        selectedPayment: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('selectedPayment', function(value) {
          scope.selectedPayment = scope.selectedPayment;
        }, true);

        scope.selection = [
          {
            id: 0,
            value: "MasterCard"
          },
          {
            id: 1,
            value: "VISA"
          },
          {
            id: 2,
            value: "American Express"
          },
          {
            id: 3,
            value: "Postcard"
          },
          {
            id: 4,
            value: "Maestro"
          },
          {
            id: 5,
            value: "Barzahlung"
          },
          {
            id: 6,
            value: "Rechnung"
          },
          {
            id: 7,
            value: "Vorauszahlung"
          },
          {
            id: 8,
            value: "Gutschein"
          }
        ]
      }
    };
  });
