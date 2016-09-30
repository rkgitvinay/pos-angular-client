'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:selectCustomer
 * @description
 * # selectCustomer
 */
angular.module('iklinikPosApp')
  .directive('selectCustomer', function (ModalService, HttpService, $q) {

    function search(searchString) {
      var defer = $q.defer();
      HttpService.POST({search_string: searchString} ,'/customer-search').then(function(response) {
        defer.resolve(response.data.content);
      });
      return defer.promise;
    }

    return {
      templateUrl: 'views/directives/selectCustomer.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        customer: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.table = {};
        scope.search = {string:'', isLoading: false};
        scope.customer = {data: [], selected: {}};

        scope.searchCustomer = function() {
          ModalService.showModal({
            templateUrl: "views/modal/searchForCustomer.html",
            controller: "SearchForCustomerModalCtrl",
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
        };

        scope.updateSearch = function() {
          if(!scope.search.isLoading) {
            if(scope.search.string.length > 3) {
              scope.search.isLoading = true;
              search(scope.search.string).then(function(result) {
                scope.search.isLoading = false;
                scope.customer.data = result;
              }, function(result) {
                scope.search.isLoading = false;
                console.log('error');
              });
            }
          }
        };
      }
    };
  })
  .controller('SearchForCustomerModalCtrl',function($scope) {
  });
