'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('UserCtrl', function ($scope, $state, HttpService, DTOptionsBuilder, DTColumnBuilder, $q, $filter, $stateParams, ModalService) {

    $scope.table = {};
    $scope.user = {};
    $scope.isEdit = false;
    $scope.userDeleted = false;

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      HttpService.GET('/users').then(function(response) {
        defer.resolve(response.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('rowCallback', rowCallback);

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('email').withTitle($filter('translate')('email')),
      DTColumnBuilder.newColumn('username').withTitle($filter('translate')('username')),
      DTColumnBuilder.newColumn('first_name').withTitle($filter('translate')('first_name')),
      DTColumnBuilder.newColumn('last_name').withTitle($filter('translate')('last_name'))
    ];

    function rowCallback(nRow, aData) {
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
          $state.go('userEdit',{id: aData.id});
        });
      });

      return nRow;
    }

    function validation(form) {
      if(form.$valid) {
        if($scope.user.isUpdatePassword) {
          if($scope.user.password !== $scope.user.passwordRetype) {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.passwordsDoNotMatch')});
            return false;
          } else if($scope.user.password.length < 5) {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.passwordMinimumLength')});
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.yourFormHasErrors')});
        return false;
      }
    }

    function deleteUser(user) {
      $scope.alerts = [];
      HttpService.DELETE({}, '/user/' + user.id).then(function(response) {
        $scope.userDeleted = true;
        $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
      }, function(response) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
      });
    }

    $scope.save = function(form) {
      $scope.alerts = [];
      if(validation(form)) {
        if(parseInt($stateParams.id) > 0) {
          $scope.user.id = $stateParams.id;
          HttpService.PUT($scope.user, '/user').then(function(response) {
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function(response) {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
          });
        } else {
          HttpService.POST($scope.user, '/user').then(function(response) {
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function(response) {
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
            deleteUser($scope.user);
          }
        });
      });
    };

    $scope.$watch('$stateParams.id', function() {
      if(parseInt($stateParams.id) > 0) {
        HttpService.GET('/user/' + $stateParams.id).then(function(response) {
          $scope.user = response.data.content;

          $scope.user.password = '';
          $scope.user.isUpdatePassword = false;
          $scope.isEdit = true;
        });
      } else {
        $scope.user = {};
        $scope.user.isUpdatePassword = true;
        $scope.isEdit = false;
      }
    });

  });
