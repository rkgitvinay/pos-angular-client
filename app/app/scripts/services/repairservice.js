'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.RepairService
 * @description
 * # RepairService
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('RepairService', function (HttpService, $q){
    // AngularJS will instantiate a singleton by calling "new" on this function
    function addRepair(data) {
      var defer = $q.defer();
      HttpService.POST(data, '/repair').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getRepair(id) {
      var defer = $q.defer();
      HttpService.GET('/repair/' + id).then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function updateRepair(data) {
      var defer = $q.defer();
      HttpService.PUT(data, '/repairupdate').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getList() {
      var defer = $q.defer();
      HttpService.GET('/repairlist').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    return {
      addRepair: addRepair,
      getRepair: getRepair,
      getList: getList,
      updateRepair: updateRepair
    };
  });
