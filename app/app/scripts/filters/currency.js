'use strict';

/**
 * @ngdoc filter
 * @name iklinikPosApp.filter:currency
 * @function
 * @description
 * # currency
 * Filter in the iklinikPosApp.
 */
angular.module('iklinikPosApp')
  .filter('countryCurrency', function (BranchService, $filter) {
    return function (input) {
      var result = BranchService.readSelectedBranch();

      return $filter('currency')(input,result.currency+' ', 2)
    };
  })

  .filter('getCurrency', function (BranchService, $filter) {
    return function (input) {
      var result = BranchService.readSelectedBranch();

      return result.currency;
    };
  })

  .filter('getBranchPrice', function (BranchService, $filter) {
    return function (product) {
      var branch = BranchService.readSelectedBranch();

      var price = 0;
      product.product_name.product.forEach(function(p) {
        if(p.branch_id === branch.id) {
          price = p.price;
        }
      });

      return $filter('countryCurrency')(price);
    };
  })

  .filter('getBranchQuantity', function (BranchService) {
    return function (product) {
      var branch = BranchService.readSelectedBranch();

      var quantity = 0;
      product.product_name.product.forEach(function(p) {
        if(p.branch_id === branch.id) {
          quantity = p.quantity;
        }
      });

      return quantity;
    };
  });
