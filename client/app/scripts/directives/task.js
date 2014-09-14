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
            $scope.changeTime = function(task, difference, event) {
                UpdateTicketService.changeTime(task, difference, function() {
                    $scope.$emit('reloadBoard');
                });
                event.preventDefault();
                event.stopPropagation();
            };
        }
    };
});