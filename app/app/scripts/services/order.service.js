'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.order
 * @description
 * # order
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('OrderService', function (HttpService, $q) {

    function addOrder(data) {
      var defer = $q.defer();
      HttpService.POST(data, '/order').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getOrder(id) {
      var defer = $q.defer();
      HttpService.GET('/order/' + id).then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    return {
      addOrder: addOrder,
      getOrder: getOrder
    }
  });
