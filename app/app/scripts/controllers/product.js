/**
 * Created by robinengbersen on 30.08.16.
 */
'use strict';

/**
 * @ngdoc function
 * @name iklinikPosApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the iklinikPosApp
 */
angular.module('iklinikPosApp')
  .controller('ProductCtrl', function ($scope, HttpService, DTOptionsBuilder, DTColumnBuilder, $q, $filter, $state, BranchService, $stateParams, ModalService) {

    $scope.alerts = [];
    $scope.isEdit = false;
    $scope.isUpdated = false;
    $scope.table = {};
    $scope.product = {
      branchesProducts: [],
      id: 0,
      name: ''
    };

    $scope.save = function(form) {
      $scope.alerts = [];
      if(form.$valid) {
        if(validation()) {
          HttpService.POST($scope.product, '/product').then(function(response) {
            $scope.isUpdated = true;
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function(response) {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
          });
        }
      } else {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.yourFormHasErrors')});
      }
    };

    $scope.update = function(form) {
      $scope.alerts = [];
      if(form.$valid) {
        if(validation()) {
          $scope.isUpdated = true;
          HttpService.PUT($scope.product, '/product').then(function(response) {
            $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
          }, function(response) {
            $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
          });
        }
      } else {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.yourFormHasErrors')});
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
            deleteProduct($scope.product);
          }
        });
      });
    };

    $scope.table.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      HttpService.GET('/products').then(function(response) {
        defer.resolve(response.data.content);
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('rowCallback', rowCallback);

    $scope.table.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle($filter('translate')('id')),
      DTColumnBuilder.newColumn('product_name.name').withTitle($filter('translate')('product.name')),
      DTColumnBuilder.newColumn('branch.name').withTitle($filter('translate')('branch.name')),
      DTColumnBuilder.newColumn('price').withTitle($filter('translate')('product.price'))
      .renderWith(function(data, type, full) {
        return $filter('countryCurrency')(data);
      }),
      DTColumnBuilder.newColumn('quantity').withTitle($filter('translate')('product.quantity'))
        .renderWith(function(data, type, full) {
          return $filter('pieces')(data);
        })
    ];

    function rowCallback(nRow, aData) {
      $('td', nRow).unbind('click');
      $('td', nRow).bind('click', function() {
        $scope.$apply(function() {
          $state.go('productEdit',{product_name_id: aData.product_name_id});
        });
      });

      return nRow;
    }

    function validation() {
      if(validationMinOneSelection()) {
        if(validateSelection()) {
          return true;
        } else {
          $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.product.fill_out_price_and_inventory_for_every_checked_product')});
          return false;
        }
      } else {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.product.please_define_product_price_quantity_least_one_branch')});
        return false;
      }
    }

    function validateSelection() {
      for(var i=0;i<$scope.product.branchesProducts.length;i++) {
        if($scope.product.branchesProducts[i].isChecked) {
          if($scope.product.branchesProducts[i].product.price === '' || $scope.product.branchesProducts[i].product.price === undefined) {
            return false;
          } else if($scope.product.branchesProducts[i].product.quantity === '' || $scope.product.branchesProducts[i].product.quantity === undefined) {
            return false;
          }
        }
      }

      return true;
    }

    function validationMinOneSelection() {
      for(var i=0;i<$scope.product.branchesProducts.length;i++) {
        if($scope.product.branchesProducts[i].isChecked) {
          return true;
        }
      }

      return false;
    }

    function deleteProduct(product) {
      $scope.alerts = [];
      HttpService.DELETE({}, '/product/' + product.id).then(function(response) {
        $scope.isUpdated = true;
        $scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
      }, function(response) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
      });
    }

    function getBranches() {
      var defer = $q.defer();
      BranchService.get().then(function(result) {
        defer.resolve(result);
      });

      return defer.promise;
    }

    function migrateBranchesAndProducts(branches, products) {
      var branchesProducts = [];

      for(var i=0;i<branches.length;i++) {
        branchesProducts.push(branches[i]);
        branchesProducts[i].isChecked = false;
        for(var j=0;j<products.length;j++) {
          if(products[j].branch_id === branches[i].id) {
            branchesProducts[i].product = products[j];
            branchesProducts[i].isChecked = true;
          }
        }
      }

      return branchesProducts;
    }

    function addProductsToBranches(branches) {
      var branchesProducts = [];

      for(var i=0;i<branches.length;i++) {
        branchesProducts.push(branches[i]);
        branchesProducts[i].isChecked = false;
        branchesProducts[i].product = {};
      }

      return branchesProducts;
    }

    $scope.$watch('$stateParams.id', function() {
      getBranches().then(function(result) {
        $scope.branches = result;

        if(parseInt($stateParams.product_name_id) > 0) {
          HttpService.GET('/product/' + $stateParams.product_name_id).then(function(response) {
            $scope.product.branchesProducts = migrateBranchesAndProducts($scope.branches, response.data.content);
            $scope.product.name = response.data.product_name;
            $scope.product.id = $stateParams.product_name_id;

            $scope.isEdit = true;
          });
        } else {
          $scope.product.branchesProducts = addProductsToBranches($scope.branches);

          $scope.isEdit = false;
        }
      });
    });

  });
