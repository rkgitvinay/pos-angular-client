'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('LoginCtrl', function ($scope, AuthService, BranchService, $state, $filter) {

    function onLoad() {
      $scope.user = {username: '', password: '', selectedBranch: null};

      BranchService.getSelectedBranch().then(function(result) {
        $scope.user.selectedBranch = result;
      });

      BranchService.get().then(function(result) {
        $scope.branches = result;
      });
    }

    onLoad();

    $scope.submit = function() {
      $scope.alerts = [];
      return AuthService.authenticate($scope.user).then(function() {
        BranchService.setSelectedBranch($scope.user.selectedBranch);
        $state.go('dashboard');
      },function() {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.wrongCredentials')});
      });
    }
  });
