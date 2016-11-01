'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:RepaircontrollerCtrl
 * @description
 * # RepaircontrollerCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('RepairCtrl', function ( $scope, $state, ProductGroups, $compile, $filter, $mdDialog, $window, RepairService, $stateParams, BranchService, HttpService, AuthService, DTOptionsBuilder, DTColumnBuilder, $q) {
    $scope.options = {isRepair: true};
    $scope.repairId=0;

    $scope.alerts = [];
    $scope.isRepairSettled = false;

    $scope.nowTime = new Date();
    $scope.Repair = {};
    $scope.Repair.List = [];

    ProductGroups.get().then(function(result) {
      $scope.productGroups = result;
    });


    $scope.$on('$stateChangeSuccess', function () {
          // do something
      if ($state.current.name==='repairCreate') {
        initData();
      }else if ($state.current.name==='repairList') {
        //initList();
      }else if ($state.current.name ==='repairEdit') {
        initRepair();
      }
    });

    /*function initList() {
      RepairService.getList().then(function(success) {
        if(success.httpState === 200) {
          $scope.Repair.List = success.data.content;

        } else {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
          console.log(success);
        }
      }, function(error) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
        console.log(error);
      });
    }*/

    $scope.table = {};

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      RepairService.getList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('repair.id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('order.branch.name').withTitle($filter('translate')('Branch Name')),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Customer')).renderWith(function(data) {
         return data.order.customer.first_name + ' ' + data.order.customer.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Employee')).renderWith(function(data) {
         return data.order.user.first_name + ' ' + data.order.user.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Model')).renderWith(function(data) {
          var prds = "<span style='padding:0px 10px;'>";
          for (var i = 0; i < data.order.products.length; i++) {
            if (i>0) {
              prds+=',';
            }
            prds += data.order.products[i].name;
          }
         return prds+'</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Price')).renderWith(function(data) {
         return $filter('currency')(data.order.price_net);
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Created At')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.repair.created_at), "dd.MM.yyyy HH:mm") + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Pickup Time')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.repair.pickup_time), "dd.MM.yyyy HH:mm")  + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Status')).renderWith(function(data) {
        if (data.repair.state===0) {
          return '<span class="label label-warning">Repair Open</span>';
        }else if (data.repair.state===1) {
          return '<span class="label label-success">Repair Done</span>';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Process')).renderWith(function(data) {
        if (data.repair.state===0) {
            return '<a  ui-sref="repairEdit({\'repair_id\':'+ data.repair.id +' })" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
        }else{
            return "Customer notified";
        }
      })
    ];

    $scope.updateRepairDet = function() {
        var data = {
          repair_id: $scope.Repair.RecItem.repair.id,
          udesc: $scope.Repair.RecItem.repair.user_description
        };

        RepairService.updateRepair(data).then(function(success) {
          if(success.httpState === 200) {
            $state.go('repairList');
          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
          console.log(error);
        });
    };


    function initRepair() {
      RepairService.getRepair($stateParams.repair_id).then(function(success) {
        if(success.httpState === 200) {
          $scope.Repair.RecItem = success.data.content;

        } else {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
          console.log(success);
        }
      }, function(error) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
        console.log(error);
      });
    }

    function initData() {
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

    $scope.completeRepair = function() {
      if(validation()) {
        var branch = BranchService.readSelectedBranch();

        $scope.params.discount = $scope.products.discount;
        var data = {
          branch: branch,
          products: $scope.products.selectedProductList,
          customer: $scope.customer,
          notes: $scope.notes,
          repairnote:$scope.repairNote,
          selectedSmartphone: $scope.selectedSmartphone,
          selectedPaymentMethod: $scope.selectedPayment.method,
          params: $scope.params,
          pickuptime: $scope.pickupTime
        };

        RepairService.addRepair(data).then(function(success) {
          if(success.httpState === 201) {
            $scope.isRepairSettled = true;
            $scope.repairId = success.data.repair.id;
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.repair.creationSuccess',{repairId: $filter('repair')($scope.repairId)})});

          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
          console.log(error);
        });
      }
    };

    $scope.printEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/repair-pdf-internal/' + $scope.repairId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printCustomerPDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/repair-pdf-external/' + $scope.repairId + '?token=' + AuthService.getToken(), '_blank');
    };

    function validation() {
      $scope.alerts = [];

      if($scope.products.selected.length < 1) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.addProducts')});
        return false;
      }

      if($scope.customer.selected.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.addCustomer')});
        return false;
      }

      if($scope.selectedSmartphone.device.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.capacity.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.color.id === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.selectSmartphone')});
        return false;
      }

      if($scope.selectedSmartphone.imei === '') {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.addImei')});
        return false;
      }

      console.log($scope.selectedPayment);
      if($scope.selectedPayment === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.selectPaymentMethod')});
        return false;
      }else{
        if($scope.selectedPayment.method.id === undefined) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.selectPaymentMethod')});
          return false;
        }
      }

      if($scope.deviceHealth.waterImpact === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.deviceHealth.impact === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.deviceHealth.externalImpact === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.repairNote=== undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.pickupTime=== undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.pickupTime')});
        return false;
      }

      return true;
    }
  });
