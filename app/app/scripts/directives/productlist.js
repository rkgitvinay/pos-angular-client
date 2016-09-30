'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:ProductList
 * @description
 * # ProductList
 */
angular.module('iklinikPosApp')
  .directive('productList', function (BranchService) {

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

    function calculateProduct(id, type, listProducts) {

    }

    return {
      templateUrl: 'views/directives/productList.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        products: '='
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

        scope.$watch('products', function(value) {
          scope.products = value;
          if(scope.products.selected.product_name !== undefined) {
            scope.productList.selected = checkForDuplicates(scope.products.selected, scope.productList.selected);
          }
        }, true);
      }
    };
  });
