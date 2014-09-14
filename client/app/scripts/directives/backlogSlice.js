'use strict';

angular.module('scrumboards')
.directive('backlogSlice', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/backlogSlice.html',
        scope: {
            sprint: '=',
            storiesByProject: '=',
            showOutOfScope: '=',
        },
        link: function (scope, element) {
            element.attr('slice-name', scope.sprint.name);
            scope.sliceValue = scope.sprint.value;
            if (typeof(scope.sliceValue) === 'undefined') {
                scope.sliceValue = scope.sprint.name;
            }
        },
        controller: function($scope) {
            function getFullWidth() {
                return $(window).width()-50;
            }
            function setFullWidth() {
                $('.full-width').css('width', getFullWidth()+'px');
            }
            $scope.$on('$viewContentLoaded', setFullWidth);

            window.onresize = setFullWidth;
            $scope.fullWidth = getFullWidth();
            
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
            
            $scope.isMatchingSprint = function(story) {
                return story.sprint === $scope.sliceValue;
            };            
        }
    };
});