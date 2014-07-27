'use strict';

angular.module('scrumboards')
    .controller('ScrumboardCtrl', function ($scope, $location, $window, DataService, AGILO_URL, ObjToArrayConverter, UpdateTicketService, AGILO_KEYWORDS) {
        $scope.keywordTypes = {};       
        ObjToArrayConverter.convert(AGILO_KEYWORDS).forEach(function(keywordPattern) {
            $scope.keywordTypes[keywordPattern.type] = true;
        });
        $scope.isNotFilteredByKeyword = function(story) {
            return !story.keywords.some(function(keyword) {
                if (keyword.type) {
                    return !$scope.keywordTypes[keyword.type];
                }
                return false;
            });
        };
        
        var sprints = DataService.getSprints();
        $scope.sprints = {};
        sprints.then(function (sprints) {
            var preselectedSprint = $location.search()['sprint'] || localStorage.getItem('selectedSprint');
            if (preselectedSprint) {
                $scope.sprints.selectedSprint = sprints.data.filter(function (element) {
                    return element.name === preselectedSprint;
                })[0];
            }

            $scope.$watch('sprints.selectedSprint', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $location.search('sprint', newValue.name);
                    localStorage.setItem('selectedSprint', newValue.name);
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
        
        
        function setupSyncToLocalStorage(model, isBoolean) {
            var value = localStorage.getItem('scrumboards-'+model);
            if (isBoolean) {
                value = value === 'true';
            }
            $scope[model] = value;
            $scope.$watch(model, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    localStorage.setItem('scrumboards-'+model, newValue);
                }
            });
        }
        setupSyncToLocalStorage('compactMode', true);
        setupSyncToLocalStorage('ownerMode', true);
        setupSyncToLocalStorage('selectedOwner');

        $scope.$on('story-dragged', function (e, src, dest) {
            var storyId = src.id;
            var story = $scope.stories.filter(function (story) {
                return story.id === storyId;
            })[0];
            if (dest.id === 'done') {
                UpdateTicketService.closeTicket(story, function () {
                    $scope.$emit('reloadBoard');
                });
            }
		});
        $scope.onDragOver = function(stati, e, storyId) {
            var story = $scope.stories.filter(function(story) { return story.id === storyId; })[0];
            var dropAllowed = stati.filter(function(status) { return status === story.status; }).length === 0;
            return dropAllowed;
        };

        $scope.reload = function () {
            $scope.$emit('reloadBoard');
        };
        $scope.$on('reloadBoard', function () {
            loadStories($scope.sprints.selectedSprint);
        });

        function loadStories(selectedSprint) {
            var stories = DataService.getStoriesBySprint(selectedSprint.name);
            stories.then(function (result) {
                $scope.stories = ObjToArrayConverter.convert(result.data);
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
            angular.forEach(stories, function (story) {
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
            return story;
        }
        
        $scope.getDashboardUrl = function () {
            return AGILO_URL + '/dashboard';
        };

        $scope.getNewTaskUrl = function (story) {
            return AGILO_URL + '/newticket?src=' + story.id + '&amp;project=' + encodeURI(story.project) + '&amp;milestone=' + encodeURI(story.release) + '&amp;owner=&amp;sprint=' + encodeURI(story.sprint) + '&amp;type=task';
        };

        $scope.isStoryNew = function (story) {
            return story.status !== 'closed' && story.status !== 'assigned';
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

        $scope.doesNotMatchesSelectedOwner = function (story) {
            if (!$scope.ownerMode) {
                return false;
            }
            return story.owner !== $scope.selectedOwner;
        };

        $scope.orderBySelectedOwner = function (story) {
            if ($scope.doesNotMatchesSelectedOwner(story)) {
                return 1;
            } else {
                return 0;
            }
        };
    });
