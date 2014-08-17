'use strict';

angular.module('scrumboards')
.directive('story', function (UpdateTicketService, ExperimentalService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/story.html',
        scope: {
            backlogMode: '@',
            compactMode: '=',
            story: '='
        },
        link: function($scope) {
            $scope.experimental = ExperimentalService.isEnabled();
        },
        controller: function ($scope) {
            $scope.isStoryClosable = function (story) {
                return story.status === 'assigned';
            };
            $scope.closeTicket = function (ticket) {
                UpdateTicketService.closeTicket(ticket, function() {
                    $scope.$emit('reloadBoard');
                });
            };
            $scope.isPostitDisplayed = function(postit) {
                return !$scope.compactMode || postit.color; 
            };
        }
    };
})
.directive('storyWithTasks', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/storyWithTasks.html',
        link: function($scope) {
            $scope.showOwnerImage = function(story) {
                return story.tasks.filter(function(task) {
                    return task.owner && task.owner !== story.owner;
                }).length > 0;
            };
        }
    };
});