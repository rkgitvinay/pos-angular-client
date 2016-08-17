/**
 * Created by robinengbersen on 16.08.16.
 */

angular.module('iklinikPosApp')
  .service('BranchService', function (HttpService, $timeout, $q, $window) {

    var LS_BRANCH = 'selected_branch';

    function getSelectedBranch() {
      var deferred = $q.defer();

      var localStorage = $window.localStorage.getItem(LS_BRANCH);
      var selectedBranch = null;

      try {
        selectedBranch = JSON.parse(localStorage);
      } catch(e) {}

      if(selectedBranch === null) {
        get().then(function(result) {
          deferred.resolve(result[0]);
        });
      } else {
        deferred.resolve(selectedBranch);
      }

      return deferred.promise;
    }

    function setSelectedBranch(branch) {
      $window.localStorage.setItem(LS_BRANCH, JSON.stringify(branch));
    }

    function get() {
      var deferred = $q.defer();

      HttpService.GET('/branches').then(function(response) {
        deferred.resolve(response.data.content);
      }, function() {
        console.log('error occured');
      });

      return deferred.promise;
    }

    return {
      get:get,
      getSelectedBranch: getSelectedBranch,
      setSelectedBranch: setSelectedBranch
    }
  });
