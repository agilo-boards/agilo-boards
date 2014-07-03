'use strict';

angular.module('agiloBoardsApp')
    .directive('agiloStory', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/story.html',
            scope: {
                backlogMode: '@',
                compactMode: '=',
                story: '='
            }
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
            templateUrl: 'templates/task.html',
            scope: {
                task: '=',
                compactMode: '='
            }
        };
    })
    .directive('agiloLinks', function (AGILO_URL) {
        return {
            restrict: 'E',
            templateUrl: 'templates/links.html',
            compactMode: '@',
            scope: {
                id: '=',
                compactMode: '='
            },
            link: function(scope) {
                scope.getViewTicketUrl = function (id) {
                    return AGILO_URL + '/ticket/' + id;
                };

                scope.getEditTicketUrl = function (id) {
                    return scope.getViewTicketUrl(id) + '?pane=edit';
                };
            }
        };
    })
    .directive('scaleToFit', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var text = attrs['scaleToFit'];
                if (text.length > 8) {
                    text = text.substr(0,7)+'..';
                }
                element.text(text);
            }
        };
    });