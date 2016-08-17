/**
 * Created by robinengbersen on 01.02.16.
 */

angular.module('iklinikPosApp')
  .service('HttpService', function ($http, ENV, config, $q, $window, $injector) {

    var HTTP_TIMEOUT = 10000; // in milliseconds

    var connectionToLowIsExecuted = false;

    apiEndpoint = '';
    switch (ENV.name) {
      case 'prod':
        apiEndpoint = config.API_PROD;
        break;

      case 'dev':
        apiEndpoint = config.API_DEV;
        break;

      default:
        apiEndpoint = config.API_PROD;
    };

    var canceler = $q.defer();

    var httpConfig = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      responseType: 'json',
      timeout: HTTP_TIMEOUT
    };

    function getHttpConfig() {
      return httpConfig;
    }

    function getApiEndpoint() {
      return apiEndpoint;
    }

    function checkForToken() {
      var auth = $injector.get('AuthService');

      var token = auth.getToken();

      if(token !== undefined && token !== null) {
        httpConfig.headers.Authorization = 'Bearer ' + token;
      }
      else {
        httpConfig.headers.Authorization = '';
      }
    }

    function relogin(callback) {
      var auth = $injector.get('AuthService');

      auth.startUpLogin(function(result) {
        callback(result);
      });
    }

    /*
     Handles all GET http service calls.
     */
    function get(service) {
      console.log('HTTP GET Call: ' + service);
      var deferred = $q.defer();
      checkForToken();

      $http
        .get(apiEndpoint + service, httpConfig)
        .success(function (res, state) {
          deferred.resolve({data: res, httpState: state});
        })
        .error(function (res, state) {
          deferred.reject({data: [], httpState: state});
        });

      return deferred.promise;
    };

    /*
     Handles all POST http service calls.
     */
    function post(params, service, callback) {
      console.log('HTTP POST Call: ' + service + ' Parameter: ' + JSON.stringify(params));
      var deferred = $q.defer();
      checkForToken();

      $http
        .post(apiEndpoint + service, params, httpConfig)
        .success(function (res, state) {
          deferred.resolve({data: [], httpState: state});
        })
        .error(function (res, state) {
          deferred.reject({data: [], httpState: state});
        });

      return deferred.promise;
    };

    function connectionTooLow() {
      // connection too low
      console.log('connection too low');
    }

    function hideLoading() {
      // hide loading
    }

    return {
      POST: post,
      GET: get,
      getHttpConfig: getHttpConfig,
      getApiEndpoint: getApiEndpoint
    };
  });
