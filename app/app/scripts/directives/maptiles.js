'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:MapTiles
 * @description
 * # MapTiles
 */
angular.module('iklinikPosApp')
  .directive('mapTiles', function (ModalService) {

    var NUMBER_OF_ELEMENTS_PER_LINE = 4; // must be a number that can be devided by 12
    var productGroups;

    function reshape(ar, cols) {
      var arr = [];
      angular.copy(ar, arr);
      var newArr = [];
      while(arr.length) newArr.push(arr.splice(0,cols));

      return newArr;
    }

    return {
      templateUrl: 'views/directives/mapTiles.directives.html',
      replace: true,
      scope: {
        products: '=',
        productGroups: '='
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
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
            scope.products.selection = element.product_group_relation;
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
  });
