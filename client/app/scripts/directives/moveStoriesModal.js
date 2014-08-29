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
                scope.moveStories.movedStories = 0;
                scope.moveStories.stories.forEach(function(story) {
                    UpdateTicketService.switchSprint(story, scope.moveStories.selectedSprint.name, function() {
                        console.log('Moved story #'+story.id+' to sprint '+scope.moveStories.selectedSprint.name);
                        scope.moveStories.movedStories++;
                    });
                });
                scope.$watch('moveStories.movedStories', function (newValue) {
                    if (newValue >= scope.moveStories.stories.length) {
                        alert(scope.moveStories.movedStories+' stories successfully moved to sprint "'+scope.moveStories.selectedSprint.name+'".');
                        scope.$emit('reloadBoard');
                        scope.moveStories.movedStories = -1;
                    }
                });
            };
        }
    };
});