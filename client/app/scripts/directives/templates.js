'use strict';

angular.module('agiloBoardsApp')
    .directive('agiloStory', function (UpdateTicketService) {
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
                        $scope.$emit('agiloReloadBoard');
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
            },
            controller: function ($scope, $window, AGILO_URL) {
                $scope.getPercentage = function(task) {
                    var total = $scope.getTotalTime(task);
                    if (total === 0) {
                        return 100;
                    }
                    return task.timeDone/(total)*100;
                };
                $scope.getTotalTime = function(task) {
                    if (task.timeRemaining === -1) {
                        return task.timeDone;
                    }
                    return task.timeRemaining+task.timeDone;
                };
                $scope.isOnGoing = function(task) {
                    return task.timeRemaining === null;
                };
                
                $scope.openTicket = function (ticket, event) {
                    var url = AGILO_URL + '/ticket/' + ticket.id;
                    if (event.shiftKey) {
                        url += '?pane=edit';
                    }
                    $window.open(url);
                };

            }
        };
    })
    .directive('agiloLinks', function (AGILO_URL) {
        return {
            restrict: 'E',
            templateUrl: 'templates/links.html',
            compactMode: '@',
            scope: {
                storyId: '=',
                compactMode: '='
            },
            link: function (scope) {
                scope.getViewTicketUrl = function (id) {
                    return AGILO_URL + '/ticket/' + id;
                };

                scope.getEditTicketUrl = function (id) {
                    return scope.getViewTicketUrl(id) + '?pane=edit';
                };
            }
        };
    })
    .directive('scaleToFit', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var text = attrs['scaleToFit'];
                if (text.length > 8) {
                    text = text.substr(0, 7) + '..';
                }
                element.text(text);
            }
        };
    });