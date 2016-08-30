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
    'ngMask'
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
