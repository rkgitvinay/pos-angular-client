'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:MapTiles
 * @description
 * # MapTiles
 */
angular.module('iklinikPosApp')
  .directive('mapTiles', function (ModalService, HttpService, StorageService, BranchService) {

    var NUMBER_OF_ELEMENTS_PER_LINE = 4; // must be a number that can be devided by 12
    var productGroups;

    function reshape(ar, cols) {
      var arr = [];
      angular.copy(ar, arr);
      var newArr = [];
      while(arr.length) newArr.push(arr.splice(0,cols));

      return newArr;
    }

    function loadProducts(options, callback) {
      HttpService.GET('/product-names').then(function(response) {
        var products = response.data.content;
        var branch = BranchService.readSelectedBranch();

        var out = Array();
        products.forEach(function(product) {
          var newProduct = product.product[0];
          newProduct.name = product.name;

          if(options.isRepair !== undefined) {
            if(options.isRepair) {
              if(parseInt(product.is_repair) === 1) {
                var availableInBranches = product.product;
                availableInBranches.forEach(function(b) {
                  if(b.branch_id === branch.id) {
                    out.push(b);
                  }
                });
              }
            } else {
              var availableInBranches = product.product;
              availableInBranches.forEach(function(b) {
                if(b.branch_id === branch.id) {
                  out.push(b);
                }
              });
            }
          } else {
            var availableInBranches = product.product;
            availableInBranches.forEach(function(b) {
              if(b.branch_id === branch.id) {
                out.push(b);
              }
            });
          }
        });

        callback(out);
      });
    }

    function getRepairProducts(options, products) {
      var out = [];

      if(options.isRepair !== undefined) {
        if(options.isRepair) {
          var repairProducts = [];

          products.forEach(function(p) {
            if(parseInt(p.product_name.is_repair) === 1) {
              repairProducts.push(p);
            }
          });

          out = repairProducts;
        } else {
          out = products;
        }
      } else {
        out = products;
      }

      return out;
    }

    function getTabs() {
      var tabs = StorageService.get('search-selection');

      if(tabs !== -1) {
        return tabs;
      } else {
        tabs = [
          {id: 1, isActive: true},
          {id: 2, isActive: false}
        ];
        StorageService.set('search-selection',tabs);

        return tabs;
      }
    }

    return {
      templateUrl: 'views/directives/mapTiles.directives.html',
      replace: true,
      scope: {
        products: '=',
        productGroups: '=',
        options: '='
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.tabs = getTabs();

        loadProducts(scope.options, function(products) {
          scope.selectedProducts.select = products;
        });

        scope.selectedProducts = {
          selected: {},
          select: []
        };

        scope.columnLength = Math.floor(12 / NUMBER_OF_ELEMENTS_PER_LINE);
        scope.numberOfElementsPerLine = NUMBER_OF_ELEMENTS_PER_LINE;
        scope.numberOfLines = 0;
        scope.productMatrix = [];
        scope.staticData = {}; // will not change if the user navigates to sub levels
        scope.matrixHistory = [];

        scope.modal = null;
        scope.data = {
          modalProductSelected: {}
        };

        scope.goOutMatrix = function(element) {
          if(element === null) {
            loadMatrix(scope.staticData.productGroups);
            scope.matrixHistory = [];
          } else {
            loadMatrix(element.child);
            scope.matrixHistory.pop();
          }
        };

        scope.goIntoMatrix = function(row, col) {
          var element = scope.productMatrix[row][col];

          if(element.child.length > 0) {
            loadMatrix(element.child);

            var e = {};
            angular.copy(element, e);
            //e.child = null;
            scope.matrixHistory.push(e);

            scope.productMatrix = reshape(element.child, NUMBER_OF_ELEMENTS_PER_LINE);
            if((element.level-1) !== 0) {
              //scope.matrixHistory.push(scope.staticData.parentElement);
              scope.staticData.parentElement = element;
            } else {
              scope.staticData.parentElement = element;
            }
          } else {
            scope.products.selection = getRepairProducts(scope.options, element.product_group_relation);
            scope.products.selected = {};

            ModalService.showModal({
              templateUrl: "views/modal/selectProductBasedOnGroup.html",
              controller: "ModalCtrl",
              scope: scope
            }).then(function(modal) {
              scope.modal = modal;

              modal.element.modal();
              modal.close.then(function(result) {
                if(result) {
                  scope.products.selected = scope.data.modalProductSelected;
                  loadMatrix(scope.productGroups);
                }
              });
            });
          }
        };

        scope.dismissModal = function() {
          scope.modal.close();
        };

        scope.getNumber = function(num) {
          return new Array(num);
        };

        scope.toggleTab = function() {
          if(scope.tabs[0].isActive) {
            scope.tabs[0].isActive = false;
            scope.tabs[1].isActive = true;
          } else {
            scope.tabs[0].isActive = true;
            scope.tabs[1].isActive = false;
          }

          StorageService.set('search-selection',scope.tabs);
        };

        function loadMatrix(productGroups) {
          scope.numberOfLines = Math.ceil(productGroups.length / NUMBER_OF_ELEMENTS_PER_LINE);
          scope.productMatrix = reshape(productGroups, NUMBER_OF_ELEMENTS_PER_LINE);
        }

        scope.$watch('productGroups', function() {
          if(scope.productGroups != undefined) {
            loadMatrix(scope.productGroups);

            scope.staticData = {
              productMatrix: scope.productMatrix,
              productGroups: [],
              parentElement: {}
            };
            angular.copy(scope.productGroups, scope.staticData.productGroups);
          }
        });
      }
    };
  })

.filter('propsFilter', function($filter) {
  return function(items, searchString) {
    items = $filter('orderBy')(items, 'name');
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var text = searchString.toLowerCase();
        if (item.name.toString().toLowerCase().indexOf(text) !== -1) {
          itemMatches = true;
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = $filter('orderBy')(items, 'name');
    }

    return out;
  };
});
