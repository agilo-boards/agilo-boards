'use strict';

angular.module('scrumboards')
    .controller('ScrumboardCtrl', function ($scope, $location, $window, LinkProvider, Synchronizer, TimeHelper, DataService, ObjToArrayConverter, UpdateTicketService, AGILO_KEYWORDS) {
        $scope.keywordTypes = {};       
        ObjToArrayConverter.convert(AGILO_KEYWORDS).forEach(function(keywordPattern) {
            $scope.keywordTypes[keywordPattern.type] = true;
        });
        
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
        
        
        Synchronizer.syncToLocalStorage($scope, 'compactMode', true);
        Synchronizer.syncToLocalStorage($scope, 'ownerMode', true);
        Synchronizer.syncToLocalStorage($scope, 'selectedOwner');

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
                $scope.allTimeDone = TimeHelper.sumTimeDone($scope.stories);
                $scope.allTimeRemaining = TimeHelper.sumTimeRemaining($scope.stories);
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
        
        $scope.getDashboardUrl = function () {
            return LinkProvider.dashboardUrl;
        };

        $scope.doesNotMatchesSelectedOwner = function (story) {
            if (!$scope.ownerMode) {
                return false;
            }
            return story.owner !== $scope.selectedOwner;
        };

        $scope.orderBySelectedOwner = function (story) {
            if ($scope.ownerMode && $scope.doesNotMatchesSelectedOwner(story)) {
                return 1;
            } else {
                return 0;
            }
        };
        
        $scope.isNotFilteredByKeyword = function(story) {
            return !story.containsAnyFilteredKeywordTypes($scope.keywordTypes);
        };
    });
