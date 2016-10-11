'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:ProductList
 * @description
 * # ProductList
 */
angular.module('iklinikPosApp')
  .directive('productList', function (BranchService, ModalService, $timeout) {

    function createProductObject(selectedProduct) {
      var product = {
        id: 0,
        name: '',
        price: '',
        quantity: 0
      };

      var branch = BranchService.getBranchNow();
      var branchProduct = {};

      for(var i in selectedProduct.product_name.product) {
        if(selectedProduct.product_name.product[i].branch_id === branch.id) {
          branchProduct = selectedProduct.product_name.product[i];
          break;
        }
      }

      product.id = selectedProduct.product_name.id;
      product.name = selectedProduct.product_name.name;
      product.price = branchProduct.price;
      product.quantity = 0;

      return product;
    }

    function checkForDuplicates(selectedProduct, listProducts) {
      var product = null;
      var listProductsLength = listProducts.length;

      if(listProducts.length === 0) {
        product = createProductObject(selectedProduct);
        product.quantity = 1;
        listProducts.push(product);
      } else {
        for(var i=0;i<listProductsLength;i++) {
          if(listProducts[i].id === selectedProduct.product_name.id) {
            listProducts[i].quantity++;
            break;
          }

          if(i == (listProducts.length - 1)) {
            product = createProductObject(selectedProduct);
            product.quantity = 1;
            listProducts.push(product);
          }
        }
      }

      return listProducts;
    }

    function calculateTotalPrice(productsList, discount) {
      var branch = BranchService.readSelectedBranch();
      var total = {
        beforeDiscount: 0.0,
        gross: 0.0, // after discount
        nett: 0.0, // after tax
        tax: 0.0,
        taxAmount: 0.0,
        taxIncluded: parseInt(branch.tax_included)
      };
      total.taxAmount = parseFloat(branch.tax);

      for(var i in productsList) {
        total.beforeDiscount += parseFloat(productsList[i].price) * parseFloat(productsList[i].quantity);
      }

      total.gross = total.beforeDiscount - parseFloat(discount);

      if(total.taxIncluded === 1) {
        total.nett = total.gross;
        total.tax = total.gross / (100 + (parseFloat(total.taxAmount)*100)) * (parseFloat(total.taxAmount)*100);
      } else {
        total.tax = parseFloat(total.gross * parseFloat(total.taxAmount));
        total.nett = total.gross + total.tax;
      }

      return total;
    }

    function calculateTotalAmount(productsList) {
      var total = 0;
      for(var i in productsList) {
        total += parseInt(productsList[i].quantity);
      }
      return total;
    }

    function getDiscount(totalPrice, discount) {
      if(discount !== undefined) {
        if(discount.discountTypeIsPercent !== undefined && discount.value !== undefined) {
          if(discount.discountTypeIsPercent) {
            var a = (parseFloat(totalPrice) / 100.0) * parseFloat(discount.value);
            return a.toFixed(2);
          } else {
            return Math.round(parseFloat(discount.value));
          }
        } else {
          return 0.0;
        }
      } else {
        return 0.0;
      }
    }

    return {
      templateUrl: 'views/directives/productList.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        products: '=',
        total: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.productList = {selected: []};

        scope.increment = function(listProducts) {
          listProducts.quantity++;
        };

        scope.decrement = function(listProduct) {
          if((listProduct.quantity - 1) > 0) {
            listProduct.quantity--;
          } else {
            for(var i in scope.productList.selected) {
              if(scope.productList.selected[i].id === listProduct.id) {
                scope.productList.selected.splice(i, 1);
              }
            }
          }
        };

        scope.addDiscount = function() {
          ModalService.showModal({
            templateUrl: "views/modal/addDiscount.html",
            controller: "AddDiscountModalCtrl",
            scope: scope
          }).then(function(modal) {
            scope.modal = modal;
            modal.element.modal();
            modal.close.then(function(result) {
              $timeout(function() {
                angular.element(document.getElementsByClassName('modal-backdrop')).css('display','none');
              },500);
              if(result.success) {
                scope.products.discount = result.discount;
              }
            });
          });
        };

        scope.$watch('products.selected', function(value) {
          if(scope.products.selected.product_name !== undefined) {
            scope.productList.selected = checkForDuplicates(scope.products.selected, scope.productList.selected);
          }

          scope.discountValue = getDiscount(scope.total.beforeDiscount, scope.products.discount);
          scope.total = calculateTotalPrice(scope.productList.selected, scope.discountValue);
          scope.products.selectedProductList = scope.productList.selected;
        }, true);

        scope.$watch('products.discount', function(value) {
          scope.discountValue = getDiscount(scope.total.beforeDiscount, scope.products.discount);
          scope.total = calculateTotalPrice(scope.productList.selected, scope.discountValue);

          scope.products.selectedProductList = scope.productList.selected;
        }, true);

        scope.$watch('productList', function(value) {
          scope.discountValue = getDiscount(scope.total.beforeDiscount, scope.products.discount);

          scope.total = calculateTotalPrice(scope.productList.selected, scope.discountValue);
          scope.totalAmount = calculateTotalAmount(scope.productList.selected);

          scope.products.selectedProductList = scope.productList.selected;
        }, true);
      }
    };
  })

  .controller('AddDiscountModalCtrl',function($scope, close, HttpService, $filter) {
    $scope.alerts = [];
    $scope.selectedPartnerDiscount = {};
    $scope.discount = {};

    angular.copy($scope.products.discount, $scope.discount);
    if($scope.discount.value === undefined) {
      resetDiscountValues();
    }

    function resetDiscountValues() {
      $scope.discount = {
        discountTypeIsPercent: true,
        value: 0
      };
    }

    function getPartnerDiscounts() {
      HttpService.GET('/partner-discounts').then(function(response) {
        $scope.partnerDiscounts = response.data.content;
      }, function() {
        $scope.partnerDiscounts = [];
      });
    }

    function validation() {
      if(isNaN($scope.discount.value)) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.incorrectNumber')});
        return false;
      } else if(parseFloat($scope.discount.value) >= 100.0 && $scope.discount.discountTypeIsPercent) {
        $scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.order.maxDiscountValueAvailable')});
        return false;
      } else {
        return true;
      }
    }

    $scope.updateDiscount = function() {
      $scope.discount.discountTypeIsPercent = true;
      $scope.discount.value = parseInt($scope.selectedPartnerDiscount.discount);
    };

    $scope.selectDiscountInModal = function() {
      $scope.alerts = [];
      if(validation()) {
        close({success: true, discount: $scope.discount}, 200); // close, but give 200ms for bootstrap to animate
      }
    };

    $scope.dismissModal = function(result) {
      close({success: false, discount: null}, 200); // close, but give 200ms for bootstrap to animate
    };

    getPartnerDiscounts();
  });
