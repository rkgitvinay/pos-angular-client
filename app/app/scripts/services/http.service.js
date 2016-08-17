/**
 * Created by robinengbersen on 01.02.16.
 */

angular.module('iklinikPosApp')
  .service('HttpService', function ($http, ENV, config, $q, $window) {

    var LS_TOKEN = 'token';
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
      var token = $window.localStorage.getItem(LS_TOKEN);

      if(token !== undefined && token !== '') {
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
    function get(service, callback) {
      console.log('HTTP GET Call: ' + service);
      checkForToken();

      $http
        .get(apiEndpoint + service, httpConfig)
        .success(function (res, status) {
          if(status === -1) {
            connectionTooLow();
          } else {
            callback({result: res, status: status});
          }
        })
        .error(function (res, status) {
          if(res !== null) {
            callback({result: res, status: status});
          } else {
            callback({result: res, status: status});
          }
        });
    };

    /*
     Handles all POST http service calls.
     */
    function post(params, service, callback) {
      console.log('HTTP POST Call: ' + service + ' Parameter: ' + JSON.stringify(params));
      checkForToken();

      $http
        .post(apiEndpoint + service, params, httpConfig)
        .success(function (res, status) {
          if(status === -1) {
            connectionTooLow();
          } else {
            callback({result: res, status: status});
          }
        })
        .error(function (res, status) {
          if(res !== null) {
            callback({result: res, status: status});
          } else {
            callback({result: res, status: status});
          }
        });
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
