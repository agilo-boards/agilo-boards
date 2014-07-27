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
        controller: function ($scope, $window, AGILO_URL) {
            $scope.getPercentage = function(task) {
                var total = $scope.getTotalTime(task);
                if (total === 0) {
                    return 100;
                }
                return task.timeDone/(total)*100;
            };
            $scope.getTotalTime = function(task) {
                if (task.timeRemaining === -1) {
                    return task.timeDone;
                }
                return task.timeRemaining+task.timeDone;
            };
            $scope.isOnGoing = function(task) {
                return task.timeRemaining === null;
            };

            $scope.openTicket = function (ticket, event) {
                var url = AGILO_URL + '/ticket/' + ticket.id;
                if (event.shiftKey) {
                    url += '?pane=edit';
                }
                $window.open(url);
            };

        }
    };
});