'use strict';

angular.module('scrumboards')
.directive('links', function (AGILO_URL) {
    return {
        restrict: 'E',
        templateUrl: 'templates/links.html',
        compactMode: '@',
        scope: {
            storyId: '=',
            compactMode: '='
        },
        link: function (scope) {
            scope.getViewTicketUrl = function (id) {
                return AGILO_URL + '/ticket/' + id;
            };

            scope.getEditTicketUrl = function (id) {
                return scope.getViewTicketUrl(id) + '?pane=edit';
            };
        }
    };
});