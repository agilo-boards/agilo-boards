'use strict';

angular.module('agiloBoardsApp')
    .directive('agiloStory', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/story.html'
        };
      });