/**
 * Created by robinengbersen on 16.08.16.
 */

angular.module('iklinikPosApp')
  .service('BranchService', function (HttpService, $timeout, $q, $window) {

    var LS_BRANCH = 'selected_branch';

    function getBranchNow() {
      var localStorage = $window.localStorage.getItem(LS_BRANCH);
      var selectedBranch = null;

      try {
        selectedBranch = JSON.parse(localStorage);
      } catch(e) {}

      return selectedBranch;
    }

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

    function readSelectedBranch() {
      return JSON.parse($window.localStorage.getItem(LS_BRANCH));
    }

    function setSelectedBranch(branch) {
      get().then(function(branches) {
        var breakWorked = false;
        for(var i=0;i<branches.length;i++) {
          if(parseInt(branches[i].id) === parseInt(branch.id)) {
            $window.localStorage.setItem(LS_BRANCH, JSON.stringify(branches[i]));
            breakWorked = true;
            break;
          }
        }

        if(!breakWorked) {
          $window.localStorage.setItem(LS_BRANCH, JSON.stringify(branch));
        }
      });
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
      readSelectedBranch: readSelectedBranch,
      getSelectedBranch: getSelectedBranch,
      setSelectedBranch: setSelectedBranch,
      getBranchNow: getBranchNow
    }
  });
