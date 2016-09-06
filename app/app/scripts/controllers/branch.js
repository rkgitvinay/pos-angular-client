'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:BranchCtrl
 * @description
 * # BranchCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('BranchCtrl', function ($scope, BranchService, $filter, DTOptionsBuilder, DTColumnBuilder, $q, $state, $stateParams, HttpService, ModalService) {

    $scope.table = {};
    $scope.alerts = [];

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      BranchService.get().then(function(result) {
        defer.resolve(result);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('rowCallback', rowCallback);

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('name').withTitle($filter('translate')('name')),
      DTColumnBuilder.newColumn('city').withTitle($filter('translate')('city')),
      DTColumnBuilder.newColumn('country').withTitle($filter('translate')('country')),
      DTColumnBuilder.newColumn('currency').withTitle($filter('translate')('currency'))
    ];

    function rowCallback(nRow, aData) {
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
          $state.go('branchEdit',{id: aData.id});
        });
      });

      return nRow;
    }

    function getBranches() {
      BranchService.get().then(function(result) {
        $scope.branches = result;
      })
    }

    function validation(form) {
      if(form.$valid) {
        if($scope.branch.copyData) {
          if($scope.branch.selectedCopyDataBranch === undefined || $scope.branch.selectedCopyDataBranch === '') {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.branch.selectBranchForCopy')});
            return false;
          }
        }
      } else {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.yourFormHasErrors')});
        return false;
      }

      return true;
    }

    function deleteBranch(branch) {
      $scope.alerts = [];
      HttpService.DELETE({}, '/branch/' + branch.id).then(function(response) {
        $scope.branchDeleted = true;
        $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
      }, function(response) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
      });
    }

    getBranches();

    $scope.save = function(form) {
      $scope.alerts = [];
      if(validation(form)) {
        if($scope.isEdit) {
          HttpService.PUT($scope.branch, '/branch').then(function(response) {
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function() {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
          });
        } else {
          HttpService.POST($scope.branch, '/branch').then(function(response) {
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function() {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
          });
        }
      }
    };

    $scope.delete = function() {
      ModalService.showModal({
        templateUrl: "views/modal/deletionConfirmation.html",
        controller: "ModalCtrl"
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          if(result) {
            deleteBranch($scope.branch);
          }
        });
      });
    };

    $scope.$watch('$stateParams.id', function() {
      if(parseInt($stateParams.id) > 0) {
        HttpService.GET('/branch/' + $stateParams.id).then(function(response) {
          $scope.branch = response.data.content;

          $scope.isEdit = true;
          $scope.branchDeleted = false;
        });
      } else {
        $scope.branch = {};
        $scope.isEdit = false;
      }
    });
  });
