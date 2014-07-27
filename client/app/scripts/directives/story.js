'use strict';

angular.module('scrumboards')
.directive('story', function (UpdateTicketService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/story.html',
        scope: {
            backlogMode: '@',
            compactMode: '=',
            story: '='
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
            $scope.getImagePath = function (owner) {
                if (!owner) {
                    return null;
                }
                return 'images/team/' + owner + '.jpg';
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
        templateUrl: 'templates/storyWithTasks.html'
    };
});