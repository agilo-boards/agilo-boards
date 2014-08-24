'use strict';

angular.module('scrumboards')
.directive('task', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/task.html',
        scope: {
            task: '=',
            compactMode: '=',            
            fadedOut: '=',
            showOwnerImage: '@'
        },
        controller: function ($scope, $window, UpdateTicketService) {
            $scope.openTicket = function (ticket, event) {
                var url = ticket.getViewTicketUrl();
                if (event.shiftKey) {
                    url = ticket.getEditTicketUrl();
                }
                $window.open(url);
            };
            $scope.changeTime = function(task, difference) {
                UpdateTicketService.changeTime(task, difference, function() {
                    $scope.$emit('reloadBoard');
                });
            };
        }
    };
});