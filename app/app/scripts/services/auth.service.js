/**
 * Created by robinengbersen on 16.08.16.
 */

angular.module('iklinikPosApp')
  .service('AuthService', function (HttpService, $timeout, $q, $window) {

    var LS_TOKEN = 'token';

    function authenticate(params) {
      var deferred = $q.defer();

      HttpService.POST(params, '/authenticate').then(function(response) {
        if(response.httpState === 200) {
          setToken(response.data.content);
          $timeout(function() {
            deferred.resolve();
          }, 500);
        } else {
          setToken('');
          $timeout(function() {
            deferred.reject();
          }, 500);
        }
      }, function() {
        setToken('');
        $timeout(function() {
          deferred.reject();
        }, 500);
      });

      return deferred.promise;
    }

    function setToken(token) {
      $window.localStorage.setItem(LS_TOKEN, token);
    }

    function getToken() {
      return $window.localStorage.getItem(LS_TOKEN);
    }

    return {
      authenticate:authenticate,
      getToken: getToken
    }
  });
