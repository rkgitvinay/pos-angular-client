'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.customer
 * @description
 * # customer
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('CustomerService', function (HttpService, $q) {

    function get(id) {
      var defer = $q.defer();

      HttpService.GET('/customer/' + id).then(function(response) {
        defer.resolve(response.data.content);
      });

      return defer.promise;
    }

    function getAll() {
      var defer = $q.defer();

      HttpService.GET('/customers').then(function(response) {
        defer.resolve(response.data.content);
      });

      return defer.promise;
    }

    return {
      get: get,
      getAll: getAll
    }
  });
