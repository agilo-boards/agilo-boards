'use strict';

angular.module('scrumboards')
.directive('task', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/task.html',
        scope: {
            task: '=',
            compactMode: '='
        },
        controller: function ($scope, $window) {
            $scope.openTicket = function (ticket, event) {
                var url = ticket.getViewTicketUrl();
                if (event.shiftKey) {
                    url = ticket.getEditTicketUrl();
                }
                $window.open(url);
            };
        }
    };
});