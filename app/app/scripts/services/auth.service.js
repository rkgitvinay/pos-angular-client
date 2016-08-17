/**
 * Created by robinengbersen on 16.08.16.
 */

angular.module('iklinikPosApp')
  .service('AuthService', function ($http, $timeout, $q) {

    function authenticate(username, password) {
      var defer = $q.defer();
      $timeout(function ()
      {
        defer.resolve({
          msg: 'SUCCESS'
        });
      }, 20500);
      return defer.promise;
    }

    return {
      authenticate:authenticate
    }
  });
