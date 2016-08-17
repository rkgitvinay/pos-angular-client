'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('LoginCtrl', function ($scope, AuthService, BranchService) {

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
      return AuthService.authenticate($scope.user).then(function() {
        console.log('login success');
      },function() {
        console.log('login error');
      });
    }
  });
