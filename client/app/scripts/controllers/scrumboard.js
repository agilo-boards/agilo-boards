'use strict';

angular.module('agiloBoardsApp')
    .controller('ScrumboardCtrl', function ($scope, $location, $window, Agilo, AGILO_URL, ObjToArrayConverter, UpdateTicketService) {
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
                $scope.stories = ObjToArrayConverter.convert(result.stories);
                $scope.stories.map(enrichStory);
                $scope.allTimeDone = sum($scope.stories, function (story) {
                    return story.timeDone;
                });
                $scope.allTimeRemaining = sum($scope.stories, function (story) {
                    return story.timeRemaining;
                });
                $scope.owners = ObjToArrayConverter.convert(collectOwners($scope.stories));
            }, function (error) {
                $('#messageContainer').append('<div class="error">' + error + '</div>');
            });
        }
        
        function collectOwners(stories) {
            var owners = {};
            angular.forEach(stories, function(story) {
                if (story.owner) {
                    owners[story.owner] = story.owner;
                }
            });
            return owners;
        }

        function enrichStory(story) {
            story.timeRemaining = sum(story.tasks, function (task) {
                return task.timeRemaining;
            });
            story.timeDone = sum(story.tasks, function (task) {
                return task.timeDone;
            });
            story.postits = parseKeywords(story.keywords);
            return story;
        }
        
        function parseKeywords(keywordsStr) {
            if ((keywordsStr.indexOf('[') === 0) && (keywordsStr.lastIndexOf(']') === keywordsStr.length-1)) {
                keywordsStr = keywordsStr.substring(1, keywordsStr.length-1);
            }
            var keywords = keywordsStr.split(',');
            function keywordNotEmpty(keyword) {
                return keyword.length > 0;
            }
            function trimKeyword(keyword) {
                return keyword.trim();
            }
            function shortenKeyword(keyword) {
                if (keyword.length > 9) {
                    return keyword.substr(0, 8)+'..';
                }
                return keyword;
            }
            return keywords.map(shortenKeyword).map(trimKeyword).filter(keywordNotEmpty);
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

        $scope.matchesSelectedOwner = function(story) {
            if (!$scope.ownerMode) {
                return true;
            }
            return story.owner === $scope.selectedOwner;
        };
        
        $scope.orderBySelectedOwner = function(story) {
            if ($scope.matchesSelectedOwner(story)) {
                return 0;
            } else {
                return 1;
            }
        };
    });
