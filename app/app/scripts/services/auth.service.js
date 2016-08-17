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
          deferred.resolve();
        } else {
          setToken('');
          deferred.reject();
        }
      }, function() {
        setToken('');
        deferred.reject();
      });

      return deferred.promise;
    }

    function setToken(token) {
      $window.localStorage.setItem(LS_TOKEN, token);
    }

    function getToken() {
      var token = null;

      try {
        token = JSON.parse($window.localStorage.getItem(LS_TOKEN));
      } catch(e) {}

      return token;
    }

    return {
      authenticate:authenticate,
      getToken: getToken
    }
  });
