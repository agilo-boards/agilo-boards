'use strict';

angular.module('scrumboards')
.directive('progressBar', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/progressBar.html',
        scope: {
            ticket: '='
        },
        controller: function($scope) {
            $scope.timeDone = $scope.ticket.timeDone;
            if (angular.isFunction($scope.ticket.timeDone)) {
                $scope.timeDone = $scope.ticket.timeDone();
            }
            $scope.timeRemaining = $scope.ticket.timeRemaining;
            if (angular.isFunction($scope.ticket.timeRemaining)) {
                $scope.timeRemaining = $scope.ticket.timeRemaining();
            }
            $scope.getPercentage = function() {
                var total = $scope.ticket.totalTime();
                if (total === 0) {
                    return 100;
                }
                return $scope.timeDone/(total)*100;
            };
        }
    };
});