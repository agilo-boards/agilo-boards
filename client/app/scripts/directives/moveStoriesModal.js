'use strict';

angular.module('scrumboards')
.directive('moveStoriesModal', function (UpdateTicketService, MessageService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/moveStoriesModal.html',
        controller: function($scope) {
            $scope.switchSprint = function(ticket) {
                var selectedSprint = $scope.moveState.selectedSprint.name;
                UpdateTicketService.switchSprint(ticket, selectedSprint, function() {
                    $('#ticket-to-move-'+ticket.id).append('<span class="success"> (Moved)</span>');
                    $scope.moveState.count++;
                }, function() {
                    $('#ticket-to-move-'+ticket.id).append('<span class="error"> (Failed)</span>');
                    $('#move-stories-messages').append(MessageService.error(null, 'Failed: ', 'Failed to move ticket <a href="'+ticket.getViewTicketUrl()+'">#'+ticket.id+'</a>'));
                });
            };
            $scope.isStoryOpenOrInProgress = function(story) {
                return story.isInProgress || story.isToDo;
            };
            $scope.isTaskClosed = function(task) {
                return task.isClosed();
            };
            $scope.isSprintSameMilestoneButNotSelected = function(sprint) {
                return sprint.milestone === $scope.sprints.selectedSprint.milestone && sprint !== $scope.sprints.selectedSprint;
            };
            
            $scope.moveStories = function() {
                $scope.moveState.count = 0;
                $scope.moveState.started = true;
                var max = 0;
                $scope.moveState.stories.forEach(function(story) {
                    max += 1 + story.tasks.filter($scope.isTaskClosed).length;
                    $scope.switchSprint(story);
                    story.tasks.filter($scope.isTaskClosed).forEach(function(task) {
                        $scope.switchSprint(task);
                    });
                });
                $scope.moveState.max = max;
                $scope.$watch('moveState.count', function (newValue) {
                    if (newValue >= $scope.moveState.max) {
                        $('#move-stories-messages').append(MessageService.success(null, 'Successully finished:', $scope.moveState.count+' tickets successfully moved to sprint '+$scope.moveState.selectedSprint.name+'.'));
                        $scope.$emit('reloadBoard');
                    }
                });
            };
        },
        link: function(scope) {
            function load(){
                scope.moveState = {
                    stories: scope.stories.filter(scope.isStoryOpenOrInProgress)
                };
                
                var sprints = scope.sprints.allSprints.filter(scope.isSprintSameMilestoneButNotSelected);
                scope.moveState.selectedSprint = sprints[sprints.length-1];
                scope.$digest();
            }
            
            $('#modal-move-stories').on('show.bs.modal', load);
        }
    };
});