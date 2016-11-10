'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.RepairService
 * @description
 * # RepairService
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('QuoteService', function (HttpService, $q){
    // AngularJS will instantiate a singleton by calling "new" on this function
    function addQuote(data) {
      var defer = $q.defer();
      HttpService.POST(data, '/quote').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function addQuoteOrder(data) {
      var defer = $q.defer();
      HttpService.POST(data, '/quoteorder').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }


    function getQuote(id) {
      var defer = $q.defer();
      HttpService.GET('/quote/' + id).then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function updateQuote(data) {
      var defer = $q.defer();
      HttpService.PUT(data, '/quoteupdate').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function updateCallback(data) {
      var defer = $q.defer();
      HttpService.PUT(data, '/callbackupdate').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getList() {
      var defer = $q.defer();
      HttpService.GET('/quotelist').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getHList() {
      var defer = $q.defer();
      HttpService.GET('/quotehlist').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function getcallbackList() {
      var defer = $q.defer();
      HttpService.GET('/callbacklist').then(function(success) {
        defer.resolve(success);
      }, function(error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    return {
      addQuote: addQuote,
      getQuote: getQuote,
      getList: getList,
      getHList: getHList,
      updateQuote: updateQuote,
      getcallbackList: getcallbackList,
      updateCallback: updateCallback,
      addQuoteOrder: addQuoteOrder
    };
  });
