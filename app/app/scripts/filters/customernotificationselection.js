'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:customerNotificationSelection
 * @function
 * @description
 * # customerNotificationSelection
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('customerNotificationSelection', function () {
    return function (notifications) {
      var out = '';
      if(angular.isArray(notifications)) {
        notifications.forEach(function(n) {
          if(n.isActive) {
            out = n.name;
          }
        });
      }

      return out;
    };
  });
