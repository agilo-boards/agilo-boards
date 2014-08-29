'use strict';

angular.module('scrumboards')
.directive('moveStoriesModal', function (UpdateTicketService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/moveStoriesModal.html',
        link: function (scope) {
            
            scope.moveStories = {};
            scope.$watch('stories', function(stories) {
                if (stories && !scope.moveStories.stories) {
                    scope.moveStories.stories = stories.filter(function(story) {
                        return story.isInProgress || story.isToDo;
                    });
                }
            });
            scope.$watch('sprints.selectedSprint', function(selectedSprint) {
                if (selectedSprint && !scope.moveStories.selectedSprint) {
                    scope.moveStories.sprints = scope.sprints.allSprints.filter(function(sprint) {
                        return sprint.milestone === selectedSprint.milestone && sprint !== selectedSprint;
                    });
                    scope.moveStories.selectedSprint = scope.moveStories.sprints[scope.moveStories.sprints.length-1];
                }
            });
            
            scope.moveStories = function() {
                scope.moveStories.movedTickets = 0;
                scope.moveStories.amountOfTicketsToMove = 0;
                scope.moveStories.stories.forEach(function(story) {
                    scope.moveStories.amountOfTicketsToMove += 1 + story.tasks.length;
                    UpdateTicketService.switchSprint(story, scope.moveStories.selectedSprint.name, function() {
                        console.log('Moved story #'+story.id+' to sprint '+scope.moveStories.selectedSprint.name);
                        scope.moveStories.movedTickets++;
                    });
                    story.tasks.forEach(function(task) {
                        UpdateTicketService.switchSprint(task, scope.moveStories.selectedSprint.name, function() {
                            console.log('Moved task #'+task.id+' to sprint '+scope.moveStories.selectedSprint.name);
                            scope.moveStories.movedTickets++;
                        });
                    });
                });
                scope.$watch('moveStories.movedTickets', function (newValue) {
                    if (newValue >= scope.moveStories.amountOfTicketsToMove) {
                        console.log(scope.moveStories.movedTickets+' tickets successfully moved to sprint '+scope.moveStories.selectedSprint.name+'.');
                        scope.$emit('reloadBoard');
                        scope.moveStories.movedTickets = -1;
                    }
                });
            };
        }
    };
});