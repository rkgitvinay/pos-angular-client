'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.ProductGroups
 * @description
 * # ProductGroups
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('ProductGroups', function (HttpService, $q) {

    function get() {
      var defer = $q.defer();

      HttpService.GET('/product-groups').then(function(response) {
        defer.resolve(response.data.content);
      }, function() {
        defer.reject([]);
      });

      return defer.promise;
    }

    return {
      get: get
    }
  });
