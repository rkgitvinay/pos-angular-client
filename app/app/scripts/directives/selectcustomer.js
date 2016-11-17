'use strict';

/**
 * @ngdoc directive
 * @name iklinikPosApp.directive:selectCustomer
 * @description
 * # selectCustomer
 */
angular.module('iklinikPosApp')
  .directive('selectCustomer', function (ModalService, HttpService, $q, $timeout) {

    function search(searchString) {
      var defer = $q.defer();
      HttpService.POST({search_string: searchString} ,'/customer-search').then(function(response) {
        defer.resolve(response.data.content);
      });
      return defer.promise;
    }

    function notificationMethod(email, mobile) {
      if(email.toString().length === 0 && email.toString().length !== 0) {
        return [
          {
            id: 1,
            isActive: true,
            name: 'via mobile',
            value: mobile
          },
          {
            id: 3,
            isActive: false,
            name: 'via callback'
          }
        ];
      } else if(email.toString().length !== 0 && email.toString().length === 0) {
        return [
          {
            id: 2,
            isActive: true,
            name: 'via email',
            value: email
          },
          {
            id: 3,
            isActive: false,
            name: 'via callback'
          }
        ];
      } else if(email.toString().length !== 0 && email.toString().length !== 0) {
        return [
          {
            id: 1,
            isActive: true,
            name: 'via mobile',
            value: mobile
          },
          {
            id: 2,
            isActive: false,
            name: 'via email',
            value: email
          },
          {
            id: 3,
            isActive: false,
            name: 'via callback'
          }
        ];
      } else {
        return [
          {
            id: 3,
            isActive: false,
            name: 'via callback'
          }];
      }
    }

    return {
      templateUrl: 'views/directives/selectCustomer.directives.html',
      replace: true,
      restrict: 'E',
      scope: {
        customer: '=',
        options: '=',
        notificationindex: '=',
        iscustset: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.table = {};
        scope.search = {string:'', isLoading: false};

        //scope.customer.selected = {"id":3,"type":"private","sex":"male","first_name":"Hanspeter22","last_name":"Trösch","company_name":"","address_line_one":"Bahnhofstrasse 45","address_line_two":"","zip":"8001","city":"Zürich","country":"CH","phone":"","mobile":"+41763321459","email":"mail@xorox.io","created_at":"2016-10-10 07:03:35","updated_at":"2016-10-10 08:44:18"};

        scope.$watch('customer', function(value) {
          if (scope.iscustset && scope.customer!==undefined) {
            console.log(scope.customer);
            console.log(scope.notificationindex);
            if (scope.customer.selected.id!==undefined) {
              scope.customer.selected.notification = notificationMethod(scope.customer.selected.email, scope.customer.selected.mobile);
              scope.customer.selected.notificationIndex = scope.customer.selected.notification[scope.notificationindex];
              scope.iscustset = false;
            }
          }
        }, true);

        scope.searchCustomer = function() {
          ModalService.showModal({
            templateUrl: "views/modal/searchForCustomer.html",
            controller: "SearchForCustomerModalCtrl",
            scope: scope
          }).then(function(modal) {
            scope.modal = modal;
            modal.element.modal();
            modal.close.then(function(result) {
              if(result.success) {
                scope.customer.selected = result.customer;
                scope.customer.selected.notification = notificationMethod(result.customer.email, result.customer.mobile);
                scope.customer.selected.notificationIndex = scope.customer.selected.notification[0];
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

        scope.createCustomer = function() {
          ModalService.showModal({
            templateUrl: "views/modal/createCustomer.html",
            controller: "CreateCustomerModalCtrl",
            scope: scope
          }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
              $timeout(function() {
                angular.element(document.getElementsByClassName('modal-backdrop')).css('display','none');
              },1100);
              if(result.success) {
                scope.customer.selected = result.customer;
                scope.customer.selected.notification = notificationMethod(result.customer.email, result.customer.mobile);
                scope.customer.selected.notificationIndex = scope.customer.selected.notification[0];
              }
            });
          });
        };

        scope.setNotificationForm = function(n){
          scope.customer.selected.notificationIndex = n;
        };

        scope.editCustomer = function() {
          ModalService.showModal({
            templateUrl: "views/modal/editCustomer.html",
            controller: "EditCustomerModalCtrl",
            scope: scope
          }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
              $timeout(function() {
                angular.element(document.getElementsByClassName('modal-backdrop')).css('display','none');
              },700);
              if(result.success) {
                scope.customer.selected = result.customer;
                scope.customer.selected.notification = notificationMethod(result.customer.email, result.customer.mobile);
                scope.customer.selected.notificationIndex = scope.customer.selected.notification[0];
              }
            });
          });
        }
      }
    };
  })

  .controller('SearchForCustomerModalCtrl',function($scope, close) {
    $scope.selectCustomerInModal = function(customer) {
      close({success: true, customer: customer}, 200); // close, but give 200ms for bootstrap to animate
    };

    $scope.dismissModal = function(result) {
      close({success: false, customer: null}, 200); // close, but give 200ms for bootstrap to animate
    };
  })

  .controller('CreateCustomerModalCtrl',function($scope, close) {
    $scope.order = {
      isOrder: true,
      selectCustomerInModal: function(customer) {
        close({success: true, customer: $scope.customer}, 200); // close, but give 200ms for bootstrap to animate
      }
    };

    $scope.dismissModal = function(result) {
      close({success: false, customer: $scope.customer}, 200); // close, but give 200ms for bootstrap to animate
    };
  })

  .controller('EditCustomerModalCtrl',function($scope, close) {
    $scope.customer = $scope.customer.selected;
    $scope.order = {
      isOrder: true,
      selectCustomerInModal: function(customer) {
        close({success: true, customer: $scope.customer}, 200); // close, but give 200ms for bootstrap to animate
      }
    };

    $scope.dismissModal = function(result) {
      close({success: false, customer: $scope.customer}, 200); // close, but give 200ms for bootstrap to animate
    };
  });
