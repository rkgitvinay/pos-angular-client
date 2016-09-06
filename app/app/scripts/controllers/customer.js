'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:CustomerCtrl
 * @description
 * # CustomerCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('CustomerCtrl', function ($scope, $rootScope, $stateParams, HttpService, DTOptionsBuilder, DTColumnBuilder, $filter, $q, CustomerService, $state) {

    $scope.table = {};

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      CustomerService.getAll().then(function(result) {
        defer.resolve(result);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('rowCallback', rowCallback);

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('first_name').withTitle($filter('translate')('first_name')),
      DTColumnBuilder.newColumn('last_name').withTitle($filter('translate')('last_name')),
      DTColumnBuilder.newColumn('mobile').withTitle($filter('translate')('mobile')),
      DTColumnBuilder.newColumn('zip').withTitle($filter('translate')('zip')),
      DTColumnBuilder.newColumn('city').withTitle($filter('translate')('city')),
      DTColumnBuilder.newColumn('country').withTitle($filter('translate')('country'))
    ];

    function rowCallback(nRow, aData) {
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
          $state.go('customerEdit',{id: aData.id});
        });
      });

      return nRow;
    }

    $scope.$watch('$stateParams.id', function() {
      if(parseInt($stateParams.id) > 0) {
        HttpService.GET('/customer/' + $stateParams.id).then(function(response) {
          $scope.customer = response.data.content;

          $scope.isEdit = true;
          $scope.customerDeleted = false;
        });
      } else {
        $scope.customer = {};
        $scope.isEdit = false;
      }
    });
  });
