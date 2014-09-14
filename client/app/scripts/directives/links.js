'use strict';

angular.module('scrumboards')
.directive('links', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/links.html',
        scope: {
            ticket: '='
        }
    };
});