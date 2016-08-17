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
    'angularPromiseButtons'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, angularPromiseButtonsProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
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
