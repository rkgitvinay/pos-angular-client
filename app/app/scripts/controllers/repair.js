'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:RepaircontrollerCtrl
 * @description
 * # RepaircontrollerCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('RepairCtrl', function ($scope, ProductGroups, RepairService, $stateParams) {
    $scope.options = {isRepair: true};

    $scope.alerts = [];
    $scope.isRepairSettled = false;

    ProductGroups.get().then(function(result) {
      $scope.productGroups = result;
    });

    function initData() {
      $scope.repairId = parseInt($stateParams.repair_id);

      if($scope.repairId === 0) {
        $scope.isRepairSettled = false;
        $scope.repairId = 0;

        $scope.products = {selection: [], selected: [], selectedProductList: [], repairNote: ''};
        $scope.customer = {data: [], selected: {}};
        $scope.selectedSmartphone = {device: {}, imei:''};
        $scope.selectedImei = '';
        $scope.deviceHealth = {waterImpact: {}, impact: {}, externalImpact: {}};
        $scope.params = {total: {}};
      } else {

        //RepairService.getOrder($scope.orderId).then(function(success) {
        //  $scope.order = success.data.content;
        //  console.log($scope.order);
        //}, function(error) {
        //  $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.isNotFoundOnServer')});
        //});
      }
    }
    initData();

    function validation() {
      $scope.alerts = [];

      if($scope.products.selected.length < 1) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.addProducts')});
        return false;
      }

      if($scope.customer.selected.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.addCustomer')});
        return false;
      }

      if($scope.selectedSmartphone.device.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.capacity.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.color.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.imei === '') {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.addImei')});
        return false;
      }

      if($scope.selectedPayment.method.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.selectPaymentMethod')});
        return false;
      }

      return true;
    }
  });
