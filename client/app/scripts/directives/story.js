'use strict';

angular.module('scrumboards')
.directive('story', function ($rootScope, UpdateTicketService, ExperimentalService, MessageService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/story.html',
        scope: {
            backlogMode: '@',
            hideUnknownKeywords: '=',            
            fadedOut: '=',
            story: '=',
        },
        link: function($scope, element) {
            $scope.experimental = ExperimentalService.isEnabled();
            element.attr('story-id', $scope.story.id);
            element.attr('id', 'story-'+$scope.story.id);
        },
        controller: function ($scope) {
            $scope.isStoryClosable = function (story) {
                return story.status === 'assigned';
            };
            $scope.closeTicket = function (ticket) {
                UpdateTicketService.closeTicket(ticket, function() {
                    $scope.$emit('reloadBoard');
                }, function (error) {
                    $('#messageContainer').append(MessageService.error(error, 'Unable to close the story.', 'Make sure you are logged in to modify the ticket.'));
                });
            };
            $scope.isPostitDisplayed = function(postit) {
                return (!$scope.hideUnknownKeywords && !$scope.backlogMode) || postit.color; 
            };
        }
    };
})
.directive('storyWithTasks', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/storyWithTasks.html',
        link: function($scope, element) {
            element.attr('id', 'story-and-tasks-'+$scope.story.id);
            $scope.showOwnerImage = function(story) {
                return story.tasks.filter(function(task) {
                    return task.owner && task.owner !== story.owner;
                }).length > 0;
            };
        }
    };
});