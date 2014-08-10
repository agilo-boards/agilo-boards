'use strict';

angular.module('scrumboards')
.directive('backlogSlice', function ($filter) {
    return {
        restrict: 'E',
        templateUrl: 'templates/backlogSlice.html',
        scope: {
            sliceName: '@',
            sliceValue: '@',
            storiesByProject: '=',
            showOutOfScope: '='
        },
        controller: function($scope) {
            $scope.sumStoryPoints = function() {
                var total = 0;
                function calculateSum(story) {
                    if (story.inScope && story.sprint === $scope.sliceValue) {
                        total += story.storyPoints;
                    }
                }
                for (var project in $scope.storiesByProject) {
                    $scope.storiesByProject[project].forEach(calculateSum);
                }
                return total;
            };
            
        }
    };
});