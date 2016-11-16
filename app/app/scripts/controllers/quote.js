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
    $scope.products = {selection: [], selected: [], selectedProductList: [], quoteNote: ''};
    $scope.params = {total: {}, nett: 0};
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
        initQuote(initData());
      }else if ($state.current.name ==='callbackList') {
        $scope.showCallbackDet = false;
        //getCallbacks();
      }else if ($state.current.name ==='callbackQUpdate') {
        initQuote();
        $scope.showCallbackDet = true;
        //getCallbacks();
      }else if ($state.current.name ==='quoteConfirmEdit') {
        initQuote();
        var ndt = new Date();
        var dt = new Date(ndt.getTime() + 1*24*60*60*1000);
        $scope.pickupTime = dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear() + " " + dt.getHours() + ":"+ dt.getMinutes();
        //updateCallback($stateParams.id);
      }
    });


    $scope.Quote.CQList = {};

    $scope.Quote.CQList.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      QuoteService.getcallbackList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });



    $scope.Quote.CQList.dtColumns = [
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
          return '<a  ui-sref="callbackQUpdate({\'id\':'+ data.id +' , \'quote_id\':'+ data.quote_id +'})" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
      })
    ];

    $scope.updateCallback = function(){
      if ($stateParams.id!==undefined) {
        QuoteService.updateCallback({id:$stateParams.id,quote_id:$scope.Quote.RecItem.id}).then(function(success) {
          if(success.httpState === 200) {
            $state.go('callbackListq');
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
          return '<a  ui-sref="quoteEdit({\'quote_id\':'+ data.id +' })" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
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
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.created_at), 'dd.MM.yyyy HH:mm') + '</span>';
      }),
      DTColumnBuilder.newColumn(null).withTitle($filter('translate')('Status')).renderWith(function(data) {
        if (data.state===0) {
          return '<span class="label label-warning">Quote Open</span>';
        }else if (data.state===3) {
          return '<span class="label label-success">Quote Confirmed</span>';
        }else if (data.state===2) {
          return '<span class="label label-danger">Quote Declined</span>';
        }
      })
    ];

    $scope.ctable = {};

    $scope.ctable.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      QuoteService.getCList().then(function(result) {
        defer.resolve(result.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('fnRowCallback',
     function (nRow) {
        $compile(nRow)($scope);
     });

    $scope.ctable.dtColumns = [
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
         return "<span style='padding:0px 10px;'>" + $filter('date')(new Date(data.created_at), 'dd.MM.yyyy HH:mm') + '</span>';
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
        return '<a  ui-sref="quoteConfirmEdit({\'quote_id\':'+ data.id +' })" class="md-button " ><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>';
      })
    ];

    function qvalidation() {
      $scope.alerts = [];
      if($scope.pickuptime === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.pickupTime')});
        return false;
      }

      return true;
    }

    function uvalidation() {
      $scope.alerts = [];

      if($scope.products.selected.length < 1) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.addProducts')});
        return false;
      }

      if($scope.params === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.addProducts')});
        return false;
      }

      return true;
    }
    $scope.updateQuoteDet = function() {
      if (uvalidation()) {
        var data = {
          quote_id: $scope.Quote.RecItem.id,
          udesc: $scope.Quote.RecItem.user_description,
          products: $scope.products.selectedProductList,
          params: $scope.params
        };

        QuoteService.updateQuote(data).then(function(success) {
          if(success.httpState === 200) {
            $state.go('quoteList');
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

    $scope.delineQuoteDet = function() {
        var data = {
          quote_id: $scope.Quote.RecItem.id,
          description: $scope.Quote.RecItem.customer_description
        };

        QuoteService.declineQuote(data).then(function(success) {
          if(success.httpState === 201) {
            $scope.isQuoteDeclined = true;
            $scope.orderId = success.data.order.id;
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.order.creationSuccess',{quoteId: $filter('quote')($scope.orderId)})});
          } else {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
            console.log(success);
          }
        }, function(error) {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.creationFail')});
          console.log(error);
        });
    };

    $scope.confirmQuoteDet = function() {
      if (qvalidation()) {
        var str1 = JSON.parse(JSON.stringify($scope.pickupTime));
        var dt1   = parseInt(str1.substring(0,2));
        var mon1  = parseInt(str1.substring(3,5));
        var yr1   = parseInt(str1.substring(6,10));
        var h1   = parseInt(str1.substring(11,13));
        var m1   = parseInt(str1.substring(14,16));
        $scope.pickupTime = new Date(Date.UTC(yr1, mon1-1, dt1, h1, m1));
        var data = {
          quote_id: $scope.Quote.RecItem.id,
          pickuptime: $scope.pickupTime,
          description: $scope.Quote.RecItem.customer_description
        };

        QuoteService.confirmQuote(data).then(function(success) {
          if(success.httpState === 201) {
            $scope.isQuoteConfirmed = true;
            $scope.repairId = success.data.repair.id;
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.repair.creationSuccess',{quoteId: $filter('quote')($scope.repairId)})});
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
        $scope.isQuoteSettled = false;
        $scope.customer = {data: [], selected: {}};
        $scope.selectedSmartphone = {device: {}, capacity: {}, color: {}, imei:''};
        $scope.selectedImei = '';
        $scope.deviceHealth = {waterImpact: {}, impact: {}, externalImpact: {}};
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
        var data = {
          branch: branch,
          customer: $scope.customer,
          notes: $scope.notes,
          quotenote:$scope.repairNote,
          selectedSmartphone: $scope.selectedSmartphone,
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

    $scope.printCnfEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/repair-pdf-internal/' + $scope.repairId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printCnfCustomerPDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/repair-pdf-external/' + $scope.repairId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printDecEmployeePDF = function() {
      $window.open(HttpService.getApiEndpoint() + '/order-pdf-internal/' + $scope.orderId + '?token=' + AuthService.getToken(), '_blank');
    };

    $scope.printDecCustomerPDF = function() {
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

      if($scope.deviceHealth.waterImpact.value === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.deviceHealth.impact.value === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      if($scope.deviceHealth.externalImpact.value === undefined) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.repair.deviceHealth')});
        return false;
      }

      return true;
    }
  });
