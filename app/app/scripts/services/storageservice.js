'use strict';

/**
 * @ngdoc service
 * @name iklinikPosApp.StorageService
 * @description
 * # StorageService
 * Service in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .service('StorageService', function ($window) {

    var STORE_SEARCH_SELECTION = 'search-selection';

    function set(key, object) {
      $window.localStorage.setItem(key, JSON.stringify(object));
    }

    function get(key) {
      var data = $window.localStorage.getItem(key);

      if(data !== undefined && data !== null && data !== '') {
        try {
          return JSON.parse(data);
        } catch(e) {
          return -1;
        }
      } else {
        return -1;
      }
    }

    return {
      get: get,
      set: set
    }
  });
