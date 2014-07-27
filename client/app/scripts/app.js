'use strict';

angular.module('scrumboards.agiloServices', [
    'scrumboards.helpers',
    'scrumboards.config'
]);
angular.module('scrumboards.helpers', [
    'scrumboards.config'
]);

angular
    .module('scrumboards', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'scrumboards.helpers',
        'scrumboards.agiloServices',
        'scrumboards.config'
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
