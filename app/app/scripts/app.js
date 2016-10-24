'use strict';

/**
 * @ngdoc overview
 * @name iklinikPosApp
 * @description
 * # iklinikPosApp
 *
 * Main module of the application.
 */
angular
  .module('iklinikPosApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'ui.router',
    'angularPromiseButtons',
    'datatables',
    'angularModalService',
    'ngMask',
    'countrySelect',
    'frapontillo.bootstrap-switch',
    'ui.select'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, angularPromiseButtonsProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })


      .state('productOverview', {
        url: '/product-overview',
        templateUrl: 'views/product/overview.html',
        controller: 'ProductCtrl'
      })

      .state('productCreate', {
        url: '/product-create',
        templateUrl: 'views/product/create.html',
        controller: 'ProductCtrl'
      })

      .state('productEdit', {
        url: '/product-edit/:product_name_id',
        templateUrl: 'views/product/create.html',
        controller: 'ProductCtrl'
      })



      .state('userOverview', {
        url: '/user-overview',
        templateUrl: 'views/user/overview.html',
        controller: 'UserCtrl'
      })

      .state('userCreate', {
        url: '/user-create',
        templateUrl: 'views/user/create.html',
        controller: 'UserCtrl'
      })

      .state('userEdit', {
        url: '/user-edit/:id',
        templateUrl: 'views/user/create.html',
        controller: 'UserCtrl'
      })


      .state('branchOverview', {
        url: '/branch-overview',
        templateUrl: 'views/branch/overview.html',
        controller: 'BranchCtrl'
      })

      .state('branchCreate', {
        url: '/branch-create',
        templateUrl: 'views/branch/create.html',
        controller: 'BranchCtrl'
      })

      .state('branchEdit', {
        url: '/branch-edit/:id',
        templateUrl: 'views/branch/create.html',
        controller: 'BranchCtrl'
      })


      .state('customerOverview', {
        url: '/customer-overview',
        templateUrl: 'views/customer/overview.html',
        controller: 'CustomerCtrl'
      })

      .state('customerCreate', {
        url: '/customer-create',
        templateUrl: 'views/customer/create.html',
        controller: 'CustomerCtrl'
      })

      .state('customerEdit', {
        url: '/customer-edit/:id',
        templateUrl: 'views/customer/create.html',
        controller: 'CustomerCtrl'
      })

      .state('orderCreate', {
        url: '/order-create/:order_id',
        templateUrl: 'views/order/create.html',
        controller: 'OrderCtrl'
      })

      .state('repairCreate', {
        url: '/repair-create/:repair_id',
        templateUrl: 'views/repair/create.html',
        controller: 'RepairCtrl'
      })


      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'LoginCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'LoginCtrl'
      });

    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/login');

    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
      })
      .preferredLanguage('en');

    angularPromiseButtonsProvider.extendConfig({
      spinnerTpl: '<span class="btn-spinner"></span>',
      disableBtn: true,
      btnLoadingClass: 'is-loading',
      addClassToCurrentBtnOnly: false,
      disableCurrentBtnOnly: false
    });
  });
