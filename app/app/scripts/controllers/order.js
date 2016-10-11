'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:OrderctrlCtrl
 * @description
 * # OrderctrlCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('OrderCtrl', function ($scope, ProductGroups, $filter, $window, BranchService, OrderService, $stateParams, HttpService, AuthService) {
    $scope.alerts = [];
    $scope.isOrderSettled = false;

    ProductGroups.get().then(function(result) {
      $scope.productGroups = result;
    });

    function initData() {
      if(parseInt($stateParams.order_id) === 0) {
        $scope.isOrderSettled = false;
        $scope.orderId = 0;

        $scope.products = {selection: [], selected: [], selectedProductList: []};
        $scope.customer = {data: [], selected: {}};
        $scope.selectedSmartphone = {device: {}, imei:''};
        $scope.selectedImei = '';
        $scope.selectedPayment = {method: {}};
        $scope.notes = {internal: '', external: ''};
        $scope.params = {total: {}};
      } else {
        $scope.isOrderSettled = true;
        $scope.orderId = parseInt($stateParams.order_id);

        OrderService.getOrder($scope.orderId).then(function(success) {
          $scope.order = success.data.content;
          console.log($scope.order);
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.isNotFoundOnServer')});
        });
      }
    }

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

    $scope.completeOrder = function() {
      if(validation()) {
        var branch = BranchService.readSelectedBranch();

        $scope.params.discount = $scope.products.discount;
        var data = {
          branch: branch,
          products: $scope.products.selectedProductList,
          customer: $scope.customer,
          notes: $scope.notes,
          selectedSmartphone: $scope.selectedSmartphone,
          selectedPaymentMethod: $scope.selectedPayment.method,
          params: $scope.params
        };

        OrderService.addOrder(data).then(function(success) {
          if(success.httpState === 201) {
            $scope.isOrderSettled = true;
            $scope.orderId = success.data.order.id;

            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.order.creationSuccess',{orderId: $filter('order')($scope.orderId)})});
          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.creationFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.creationFail')});
          console.log(error);
        });
      }
    };

    $scope.rewindOrder = function() {
      $window.location.reload();
    };

    $scope.printEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/order-pdf-internal/' + $scope.orderId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printCustomerPDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/order-pdf-external/' + $scope.orderId + '?token=' + AuthService.getToken(), '_blank');
    };

    initData();
  });
