'use strict';

angular.module('scrumboards')
    .controller('ScrumboardCtrl', function ($scope, $location, $window, LinkProvider, Synchronizer, TimeHelper, DataService, ObjToArrayConverter, UpdateTicketService) {
        
        var sprints = DataService.getSprints();
        $scope.sprints = {};

        $scope.$on('reloadBoard', function () {
            var selectedSprint = $scope.sprints.selectedSprint;
            var stories = DataService.getStoriesBySprint(selectedSprint.name);
            stories.then(function (result) {
                $scope.stories = ObjToArrayConverter.convert(result.data);
                $scope.allTimeDone = TimeHelper.sumTimeDone($scope.stories);
                $scope.allTimeRemaining = TimeHelper.sumTimeRemaining($scope.stories);
                $scope.owners = ObjToArrayConverter.convert(collectOwners($scope.stories));
            }, function (error) {
                $('#messageContainer').append('<div class="error">' + error + '</div>');
            });
        });
        sprints.then(function (sprints) {
            $scope.sprints.allSprints = sprints.data;
            $scope.$watch('sprints.selectedSprint', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.$emit('reloadBoard');
                }
            });
            Synchronizer.syncToLocalStorage($scope, 'sprint', {
                scopeModel: 'sprints.selectedSprint',
                transformToString: function(sprint) {
                    return sprint.name;
                },
                transformToObject: function(sprintName) {
                    return $scope.sprints.allSprints.filter(function (element) {
                        return element.name === sprintName;
                    })[0];
                },
                getParam: 'sprint',
                default: $scope.sprints.allSprints[0],
                callback: function() {
                    $scope.$emit('reloadBoard');                    
                }
            });
        }, function (error) {
            $('#messageContainer').append('<div class="error">' + error + '</div>');
        });        
        Synchronizer.syncToLocalStorage($scope, 'compactMode', { isBoolean: true });
        Synchronizer.syncToLocalStorage($scope, 'ownerMode', { isBoolean: true });
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
