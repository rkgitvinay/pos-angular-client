'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:smartphoneSelection
 * @description
 * # smartphoneSelection
 */
angular.module('iklinikPosApp')
  .directive('selectSmartphone', function () {
    return {
      templateUrl: 'views/directives/selectSmartphone.directives.html',
      restrict: 'E',
      scope: {
        selectedSmartphone: '=',
      },
      link: function postLink(scope, element, attrs) {
        if(scope.selectedSmartphone.imei !== undefined && scope.selectedSmartphone.imei !== null) {
          scope.imeiSelection = true;
        } else {
          scope.imeiSelection = false;
        }

        scope.selection = [
          {
            id: 0,
            value: "iPad"
          },
          {
            id: 10,
            value: "iPad 2"
          },
          {
            id: 20,
            value: "iPad 3"
          },
          {
            id: 30,
            value: "iPad Air"
          },
          {
            id: 31,
            value: "iPad Air 2"
          },
          {
            id: 40,
            value: "iPod"
          },
          {
            id: 50,
            value: "iPhone 3G"
          },
          {
            id: 60,
            value: "iPhone 3GS"
          },
          {
            id: 70,
            value: "iPhone 4"
          },
          {
            id: 80,
            value: "iPhone 4S"
          },
          {
            id: 90,
            value: "iPhone 5"
          },
          {
            id: 100,
            value: "iPhone 5S"
          },
          {
            id: 110,
            value: "iPhone 5C"
          },
          {
            id: 120,
            value: "Samsung"
          },
          {
            id: 130,
            value: "Nokia"
          },
          {
            id: 140,
            value: "HTC"
          },
          {
            id: 150,
            value: "Blackberry"
          },
          {
            id: 160,
            value: "Sony"
          },
          {
            id: 170,
            value: "iPad Mini"
          },
          {
            id: 180,
            value: "iPad 4"
          },
          {
            id: 190,
            value: "Nexus"
          },
          {
            id: 200,
            value: "iPad Mini"
          },
          {
            id: 210,
            value: "iPhone 6"
          },
          {
            id: 220,
            value: "iPhone 6S"
          },
          {
            id: 230,
            value: "iPhone 6 Plus"
          },
          {
            id: 240,
            value: "iPhone 6S Plus"
          },
          {
            id: 250,
            value: "iPhone SE"
          },
          {
            id: 260,
            value: "iPod 5G"
          },
          {
            id: 270,
            value: "iPad mini 2"
          },
          {
            id: 280,
            value: "iPad mini 3"
          }
        ]
      }
    };
  });
