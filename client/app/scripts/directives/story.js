'use strict';

angular.module('scrumboards')
.directive('story', function (UpdateTicketService, ExperimentalService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/story.html',
        scope: {
            backlogMode: '@',
            compactMode: '=',
            story: '=',
            prevSeq: '@',
            nextSeq: '@'
        },
        link: function($scope) {
            $scope.experimental = ExperimentalService.isEnabled();
        },
        controller: function ($scope) {
            $scope.increasable = ($scope.prevSeq!=='-1') || !$scope.story.isPlannedForNextSprint;
            $scope.decreasable = ($scope.nextSeq!=='-1') || ($scope.story.isPlannedForNextSprint || $scope.story.isReadyToImplement);
            
            $scope.increasePriority = function() {
                if ($scope.prevSeq !== '-1') {
                    var newSeqNumber = (parseInt($scope.prevSeq) || 100)+1;
                    UpdateTicketService.switchSeqNumber($scope.story, newSeqNumber, function() {
                        $scope.$emit('reloadBoard');
                    });
                } else {
                    var newDetailStatus;
                    if ($scope.story.isPlannedForNextSprint) {
                        return;
                    } else if ($scope.story.isReadyToImplement) {
                        newDetailStatus = 'Next Sprint';
                    } else {
                        newDetailStatus = 'Ready to Implement';
                    }
                    UpdateTicketService.switchDetailStatus($scope.story, newDetailStatus, function() {
                        $scope.$emit('reloadBoard');
                    });
                }
            };
            $scope.decreasePriority = function() {
                if ($scope.nextSeq !== '-1') {
                    var newSeqNumber = (parseInt($scope.nextSeq) || 100)-1;
                    UpdateTicketService.switchSeqNumber($scope.story, newSeqNumber, function() {
                        $scope.$emit('reloadBoard');
                    });
                } else {
                    var newDetailStatus;
                    if ($scope.story.isPlannedForNextSprint) {
                        newDetailStatus = 'Ready to Implement';
                    } else if ($scope.story.isReadyToImplement) {
                        newDetailStatus = '';
                    } else {
                        return;
                    }
                    UpdateTicketService.switchDetailStatus($scope.story, newDetailStatus, function() {
                        $scope.$emit('reloadBoard');
                    });
                }

            };
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