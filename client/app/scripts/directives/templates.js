'use strict';

angular.module('agiloBoardsApp')
    .directive('agiloStory', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/story.html',
            scope: {
                backlogMode: '@',
                story: '='
            }
        };
    })
    .directive('agiloStoryWithTasks', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/storyWithTasks.html',
            scope: {
                story: '='
            }
        };
    })
    .directive('agiloTask', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/task.html',
            scope: {
                task: '='
            }
        };
    });