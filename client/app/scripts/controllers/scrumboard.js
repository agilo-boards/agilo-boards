'use strict';

angular.module('agiloBoardsApp')
    .controller('ScrumboardCtrl', function ($scope, $location, $window, Agilo, AGILO_URL, UpdateTicketService) {
        var sprints = Agilo.getSprints();
        $scope.sprints = {};
        sprints.then(function (sprints) {
            var getParamSprint = $location.search()['sprint'];
            if (getParamSprint) {
                var selectedSprint = sprints.data.filter(function (element) {
                    return element.name === getParamSprint;
                });
                if (selectedSprint.length === 1) {
                    $scope.sprints.selectedSprint = selectedSprint[0];
                }
            }

            $scope.$watch('sprints.selectedSprint', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $location.search('sprint', newValue.name);
                }
            });

            if (!$scope.sprints.selectedSprint && sprints.data[0]) {
                $scope.sprints.selectedSprint = sprints.data[0];
            }

            $scope.sprints.allSprints = sprints.data;
            loadStories($scope.sprints.selectedSprint);

        }, function (error) {
            $('#messageContainer').append('<div class="error">' + error + '</div>');
        });

        $scope.reload = function () {
            loadStories($scope.sprints.selectedSprint);
        };

        function loadStories(selectedSprint) {
            var stories = Agilo.getStoriesBySprint(selectedSprint.name);
            stories.then(function (result) {
                // Convert stories to an array
                function toArray(obj) {
                    var arr = [];
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            arr.push(obj[i]);
                        }
                    }
                    return arr;
                }

                $scope.stories = toArray(result.stories);
                $scope.stories.map(enrichStory);
                $scope.allTimeDone = sum($scope.stories, function (story) {
                    return story.timeDone;
                });
                $scope.allTimeRemaining = sum($scope.stories, function (story) {
                    return story.timeRemaining;
                });
            }, function (error) {
                $('#messageContainer').append('<div class="error">' + error + '</div>');
            });
        }

        function enrichStory(story) {
            story.timeRemaining = sum(story.tasks, function (task) {
                return task.timeRemaining;
            });
            story.timeDone = sum(story.tasks, function (task) {
                return task.timeDone;
            });
            return story;
        }

        $scope.getDashboardUrl = function () {
            return AGILO_URL + '/dashboard';
        };

        $scope.getViewTicketUrl = function (id) {
            return AGILO_URL + '/ticket/' + id;
        };

        $scope.getEditTicketUrl = function (id) {
            return $scope.getViewTicketUrl(id) + '?pane=edit';
        };

        $scope.getNewTaskUrl = function (story) {
            return AGILO_URL + '/newticket?src=' + story.id + '&amp;project=' + encodeURI(story.project) + '&amp;milestone=' + encodeURI(story.release) + '&amp;owner=&amp;sprint=' + encodeURI(story.sprint) + '&amp;type=task';
        };

        $scope.isStoryNew = function (story) {
            return story.state !== 'closed' && story.state !== 'assigned';
        };

        $scope.openTicket = function (ticket, event) {
            var url = $scope.getViewTicketUrl(ticket.id);
            if (event.altKey) {
                url = $scope.getEditTicketUrl(ticket.id);
            }
            $window.open(url);
        };

        $scope.isStoryClosable = function (story) {
            return story.state === 'assigned';
        };

        $scope.closeTicket = function (ticket) {
            UpdateTicketService.closeTicket(ticket);
        };

        function sum(array, method) {
            var total = 0;
            angular.forEach(array, function (item) {
                var num = parseFloat(method(item));
                if (num && (num >= 0 || num < 0)) {
                    total += num;
                }
            });
            return total;
        }
    });
