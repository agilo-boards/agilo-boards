'use strict';

angular.module('scrumboards')
.directive('sprintFilter', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/sprintFilter.html',
        link: function (scope) {
            
            scope.resetSprints = function() {
                function isSprintFinished(sprint) {
                    return sprint.end.getTime() < (new Date()).getTime();
                }
                
                scope.sprints.map(function(sprint) {
                    sprint.selected = !isSprintFinished(sprint);
                });
            };
            
            scope.$on('reloadBoard', function () {
                scope.resetSprints();
            });
            if (scope.sprints) {
                scope.resetSprints();
            }            
        }
    };
});