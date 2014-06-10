'use strict';

angular
  .module('agiloBoardsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/scrumboard', {
        templateUrl: 'views/scrumboard.html',
        controller: 'ScrumboardCtrl'
      })
      .when('/backlog', {
          templateUrl: 'views/backlogboard.html',
          controller: 'BacklogboardCtrl'
        })
      .otherwise({
        redirectTo: '/scrumboard'
      });
  });
