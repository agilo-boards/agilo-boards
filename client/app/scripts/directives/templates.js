'use strict';

angular.module('agiloBoardsApp')
    .directive('agiloStory', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/story.html'
        };
    })
    .directive('agiloStoryWithTasks', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/storyWithTasks.html'
        };
    })
    .directive('agiloTask', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/task.html'
        };
    });