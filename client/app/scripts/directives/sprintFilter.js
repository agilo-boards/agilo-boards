'use strict';

angular.module('scrumboards')
.directive('sprintFilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/sprintFilter.html',
        link: function (scope) {
            
            scope.resetSprints = function() {
                function hasSprintStarted(sprint) {
                    return sprint.start.getTime() < (new Date()).getTime();
                }
                
                scope.sprints.map(function(sprint) {
                    sprint.selected = !hasSprintStarted(sprint);
                });
            };
            scope.showAllSprints = function() {                
                scope.sprints.map(function(sprint) {
                    sprint.selected = true;
                });
            };
            
            scope.$on('sprintsLoaded', function () {
                scope.resetSprints();
            });
            if (scope.sprints) {
                scope.resetSprints();
            }
        }
    };
});