'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:RepaircontrollerCtrl
 * @description
 * # RepaircontrollerCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('QuoteCtrl', function ( $scope, $state, ProductGroups, OrderService, $compile, $filter, $mdDialog, $window, QuoteService, $stateParams, BranchService, HttpService, AuthService, DTOptionsBuilder, DTColumnBuilder, $q) {
    $scope.options = {isRepair: true};
    $scope.quoteId=0;

    $scope.alerts = [];
    $scope.isQuoteSettled = false;
    $scope.isOrderSettled = false;

    $scope.nowTime = new Date();
    $scope.Quote = {};
    $scope.Quote.List = [];

    $scope.selectedSmartphone = {};
    $scope.products = {selection: [], selected: [], selectedProductList: []};
    $scope.params = {total:{}};
    $scope.selectedPayment={};
    $scope.showCallbackDet = false;

    $scope.order = {};


    $scope.$on('$stateChangeSuccess', function () {
          // do something
      if ($state.current.name==='quoteCreate') {
        initData();
      }else if ($state.current.name==='quoteList') {
        //initList();
      }else if ($state.current.name ==='quoteEdit') {
        initQuote();
      }else if ($state.current.name ==='callbackList') {
        $scope.showCallbackDet = false;
        //getCallbacks();
      }else if ($state.current.name ==='callbackUpdate') {
        initQuote();
        $scope.showCallbackDet = true;
        //updateCallback($stateParams.id);
      }else if ($state.current.name ==='quoteOrder') {
        $scope.order = {};
        initQuote($scope.initOrderData);
      }
    });

    $scope.initOrderData = function(){
      $scope.order = $scope.Repair.RecItem;
      $scope.isOrderSettled = false;
      $scope.orderId = 0;

      if ($scope.order.params.discount!==undefined) {
          $scope.products.discount = $scope.order.params.discount;
      }
      $scope.products.selected = $scope.order.products;
      $scope.products.selectedProductList =  $scope.order.products;
      $scope.customer = {data: [], selected: $scope.order.customer};
      $scope.selectedSmartphone = $scope.order.selection_params;

      $scope.selectedImei = $scope.order.selection_params.imei;
      $scope.selectedPayment.method = $scope.order.payment_method;
      $scope.notes = {internal: '', external: ''};
      $scope.params = $scope.order.params;
    };

    function ovalidation() {
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
      if(ovalidation()) {
        var branch = BranchService.readSelectedBranch();

        $scope.params.discount = $scope.products.discount;
        var data = {
          repair_id:$scope.order.id,
          branch: branch,
          products: $scope.products.selectedProductList,
          customer: $scope.customer,
          notes: $scope.notes,
          selectedSmartphone: $scope.selectedSmartphone,
          selectedPaymentMethod: $scope.selectedPayment.method,
          params: $scope.params
        };

        QuoteService.addQuoteOrder(data).then(function(success) {
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


    $scope.Quote.CList = {};

    $scope.Quote.CList.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      QuoteService.getcallbackList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });



    $scope.Quote.CList.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Number')).renderWith(function(data) {
          return "<span style='padding:0px 10px;' >"+ data.number +"</span>";
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Text')).renderWith(function(data) {
          return "<span style='padding:0px 10px;' >"+ data.text +"</span>";
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Created At')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.created_at), "dd.MM.yyyy HH:mm") + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Done')).renderWith(function(data) {
          return '<a  ui-sref="callbackUpdate({\'id\':'+ data.id +' , \'repair_id\':'+ data.repair_id +'})" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
      })
    ];

    $scope.updateCallback = function(){
      if ($stateParams.id!==undefined) {

        var str1 = $scope.Repair.RecItem.pickup_time;
        var dt1   = parseInt(str1.substring(0,2));
        var mon1  = parseInt(str1.substring(3,5));
        var yr1   = parseInt(str1.substring(6,10));
        var h1   = parseInt(str1.substring(11,13));
        var m1   = parseInt(str1.substring(14,16));
        $scope.Repair.RecItem.pickup_time = new Date(Date.UTC(yr1, mon1-1, dt1, h1, m1));
        QuoteService.updateCallback({id:$stateParams.id,repair_id:$scope.Repair.RecItem.id,pickuptime:$scope.Repair.RecItem.pickup_time}).then(function(success) {
          if(success.httpState === 200) {
            $state.go('callbackList');
          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.listFail')});
          console.log(error);
        });
      }
    };

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


        ProductGroups.get().then(function(result) {
          $scope.productGroups = result;
        });

    $scope.table = {};

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      QuoteService.getList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('branch.name').withTitle($filter('translate')('Branch Name')),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Customer')).renderWith(function(data) {
         return data.customer.first_name + ' ' + data.customer.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Employee')).renderWith(function(data) {
         return data.user.first_name + ' ' + data.user.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Model')).renderWith(function(data) {
          var prds = "<span style='padding:0px 10px;'>";
          for (var i = 0; i < data.products.length; i++) {
            if (i>0) {
              prds+=',';
            }
            prds += data.products[i].name;
          }
         return prds+'</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Price')).renderWith(function(data) {
         return $filter('currency')(data.price_net);
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Created At')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.created_at), "dd.MM.yyyy HH:mm") + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Status')).renderWith(function(data) {
        if (data.state===0) {
          return '<span class="label label-warning">Quote Open</span>';
        }else if (data.state===1) {
          return '<span class="label label-success">Quote Done</span>';
        }else {
          return '<span class="label label-danger">Quote Complete</span>';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Process')).renderWith(function(data) {
        if (data.state===0) {
            return '<a  ui-sref="repairEdit({\'repair_id\':'+ data.id +' })" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
        }else if (data.state===1) {
            return '<a  ui-sref="repairOrder({\'repair_id\':'+ data.id +' })" class="md-button " >Create Order</a>';
        }else{
            return "Customer Picked up";
        }
      })
    ];


    $scope.htable = {};

    $scope.htable.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      QuoteService.getHList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });

    $scope.htable.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('branch.name').withTitle($filter('translate')('Branch Name')),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Customer')).renderWith(function(data) {
         return data.customer.first_name + ' ' + data.customer.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Employee')).renderWith(function(data) {
         return data.user.first_name + ' ' + data.user.last_name;
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Model')).renderWith(function(data) {
          var prds = "<span style='padding:0px 10px;'>";
          for (var i = 0; i < data.products.length; i++) {
            if (i>0) {
              prds+=',';
            }
            prds += data.products[i].name;
          }
         return prds+'</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Price')).renderWith(function(data) {
         return $filter('currency')(data.price_net);
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Created At')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.created_at), "dd.MM.yyyy HH:mm") + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Pickup Time')).renderWith(function(data) {
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.pickup_time), "dd.MM.yyyy HH:mm")  + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Status')).renderWith(function(data) {
        if (data.state===0) {
          return '<span class="label label-warning">Repair Open</span>';
        }else if (data.state===1) {
          return '<span class="label label-success">Repair Done</span>';
        }else {
          return '<span class="label label-danger">Repair Complete</span>';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Process')).renderWith(function(data) {
        if (data.state===0) {
            return '<a  ui-sref="repairEdit({\'repair_id\':'+ data.id +' })" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
        }else if (data.state===1) {
            return '<a  ui-sref="repairOrder({\'repair_id\':'+ data.id +' })" class="md-button " >Create Order</a>';
        }else{
            return "Customer Picked up";
        }
      })
    ];

    $scope.updateRepairDet = function() {
        var data = {
          repair_id: $scope.Repair.RecItem.id,
          udesc: $scope.Repair.RecItem.user_description
        };

        QuoteService.updateRepair(data).then(function(success) {
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


    function initQuote(clf) {
      QuoteService.getQuote($stateParams.quote_id).then(function(success) {
        if(success.httpState === 200) {
          $scope.Quote.RecItem = success.data.content;
          if (clf!==undefined) {
            clf();
          }
        } else {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.quote.listFail')});
          console.log(success);
        }
      }, function(error) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.quote.listFail')});
        console.log(error);
      });
    }

    function initData() {
      if($scope.quoteId === 0) {
        $scope.isRepairSettled = false;
        $scope.repairId = 0;

        $scope.products = {selection: [], selected: [], selectedProductList: [], repairNote: ''};
        $scope.customer = {data: [], selected: {}};
        $scope.selectedSmartphone = {device: {}, imei:''};
        $scope.selectedImei = '';
        $scope.deviceHealth = {waterImpact: {}, impact: {}, externalImpact: {}};
        $scope.params = {total: {}};
      } else {

        //RepairService.getrepair($scope.repairId).then(function(success) {
        //  $scope.repair = success.data.content;
        //  console.log($scope.repair);
        //}, function(error) {
        //  $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.isNotFoundOnServer')});
        //});
      }
    }

    $scope.completeQuote = function() {
      if(validation()) {
        var branch = BranchService.readSelectedBranch();
        $scope.params.discount = $scope.products.discount;
        var data = {
          branch: branch,
          products: $scope.products.selectedProductList,
          customer: $scope.customer,
          notes: $scope.notes,
          quotenote:$scope.repairNote,
          selectedSmartphone: $scope.selectedSmartphone,
          selectedPaymentMethod: $scope.selectedPayment.method,
          params: $scope.params,
          deviceHealth: $scope.deviceHealth
        };

        QuoteService.addQuote(data).then(function(success) {
          if(success.httpState === 201) {
            $scope.isQuoteSettled = true;
              $scope.quoteId = success.data.quote.id;
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.quote.creationSuccess',{quoteId: $filter('quote')($scope.quoteId)})});

          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.quote.creationFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.quote.creationFail')});
          console.log(error);
        });
      }
    };

    $scope.OprintEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/order-pdf-internal/' + $scope.orderId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.OprintCustomerPDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/order-pdf-external/' + $scope.orderId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/quote-pdf-internal/' + $scope.quoteId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printCustomerPDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/quote-pdf-external/' + $scope.quoteId + '?token=' + AuthService.getToken(), '_blank');
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

      return true;
    }
  });
