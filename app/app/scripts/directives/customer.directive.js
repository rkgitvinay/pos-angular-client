'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:customer.directive
 * @description
 * # customer.directive
 */
angular.module('iklinikPosApp')
  .directive('customer', function (HttpService, $stateParams, ModalService, $filter, $q) {

    function deleteCustomer(customer) {
      var defer = $q.defer();
      HttpService.DELETE([], '/customer/' + customer.id).then(function(response) {
        defer.resolve(response);
      }, function() {
        defer.reject();
      });

      return defer.promise;
    }

    function validation(customer, form) {
      if(form.$valid) {
        if(customer.type === 'company') {
          if(customer.company_name === '') {
            return [false, {type: 'danger', message: $filter('translate')('alerts.customer.addCompanyName')}]
          }
        }
        if(customer.country === undefined) {
          return [false, {type: 'danger', message: $filter('translate')('alerts.customer.addCountry')}]
        }
        return [true, null];
      } else {
        return [false, {type: 'danger', message: $filter('translate')('alerts.yourFormHasErrors')}];
      }
    }

    return {
      templateUrl: 'views/directives/customer.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        customer: '=',
        customerDeleted: '=',
        save: '@',
        isEdit: '=',
        order: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.alerts = [];
        scope.sex = ['female','male'];
        scope.types = ['company','private'];

        scope.save = function(form) {
          scope.alerts = [];
          var val = validation(scope.customer, form);

          if(val[0]) {
            if(scope.isEdit) {
              HttpService.PUT(scope.customer, '/customer').then(function(response) {
                if(scope.order.isOrder) {
                  scope.order.selectCustomerInModal(scope.customer);
                } else {
                  scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
                }
              }, function() {
                scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
              });
            } else {
              HttpService.POST(scope.customer, '/customer').then(function(response) {
                if(scope.order.isOrder) {
                  scope.order.selectCustomerInModal(scope.customer);
                } else {
                  scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
                }
              }, function() {
                scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
              });
            }
          } else {
            scope.alerts.push(val[1]);
          }
        };

        scope.delete = function() {
          ModalService.showModal({
            templateUrl: "views/modal/deletionConfirmation.html",
            controller: "ModalCtrl"
          }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
              if(result) {
                deleteCustomer(scope.customer).then(function(response) {
                  scope.alerts.push({type: 'success', message: $filter('translate')('alerts.' + response.data.label)});
                }, function() {
                  scope.alerts.push({type: 'danger', message: $filter('translate')('alerts.unknown_server_error_occured')});
                });
              }
            });
          });
        };

        scope.$watch('$stateParams.id', function() {
          if(!scope.order.isOrder) {
            if(parseInt($stateParams.id) > 0) {
              HttpService.GET('/customer/' + $stateParams.id).then(function(response) {
                scope.customer = response.data.content;

                scope.isEdit = true;
                scope.customerDeleted = false;
              });
            } else {
              scope.customer = {};
              scope.isEdit = false;
            }
          } else {
            if(scope.customer.id !== undefined && scope.customer.id !== null) {
              HttpService.GET('/customer/' + scope.customer.id).then(function(response) {
                scope.customer = response.data.content;

                scope.isEdit = true;
                scope.customerDeleted = false;
              });
            }
          }
        });
      }
    };
  });
