'use strict';

angular.module('scrumboards')
    .controller('BacklogboardCtrl', function ($scope, $filter, $location, $window, DataService, UpdateTicketService, Synchronizer) {
        $scope.nextSprintStories = {};
        $scope.readyToImplementStories = {};
        $scope.remainingStories = {};
        
        $scope.$on('reloadBoard', function () {
            var storiesPromise = DataService.getStoriesByRelease($scope.selectedRelease.name);
            storiesPromise.then(function (result) {
                var projects = result.projects;
                $scope.storyMap = {};
                function addStoryToMap(story) {
                    $scope.storyMap[story.id] = story;
                }
                for (var project in projects) {
                    projects[project].forEach(addStoryToMap);
                }
                $scope.projects = projects;
            }, function (error) {
                $('#messageContainer').append('<div class="error">' + error + '</div>');
            });
        });
        var sprintPromise = DataService.getSprints();
        sprintPromise.then(function (sprints) {
            $scope.sprints = sprints.data;
        });
        var releasePromise = DataService.getReleases();
        $scope.$watch('selectedRelease', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $location.search('release', newValue.name);
                localStorage.setItem('selectedRelease', newValue.name);
            }
            
        });
        
        releasePromise.then(function (releases) {
            $scope.allReleases = releases.data;
            Synchronizer.syncToLocalStorage($scope, 'selectedRelease', {
                transformToString: function(release) {
                    return release.name;
                },
                transformToObject: function(releaseName) {
                    return $scope.allReleases.filter(function (element) {
                        return element.name === releaseName;
                    })[0];
                },
                getParam: 'release',
                default: $scope.allReleases[0],
                callback: function() {
                    $scope.$emit('reloadBoard');                    
                }
            });

        }, function (error) {
            $('#messageContainer').append('<div class="error">' + error + '</div>');
        });
        
        $scope.reload = function () {
            $scope.$emit('reloadBoard');
        };
        
        $scope.onDragOver = function(property, e, storyId) {
            var story = $scope.storyMap[storyId];
            return story[property];
        };
        $scope.$on('story-dragged', function (e, src, dest) {
            var storyId = src.id;
            var story = $scope.storyMap[storyId];
            var detailStatus = dest.getAttribute('detail-status');
            UpdateTicketService.switchDetailStatus(story, detailStatus, function () {
                $scope.$emit('reloadBoard');
            });
		});
        
        $scope.sumStoryPoints = function(stories) {
            var total = 0;
            function sumSP(story) {
                if (story.inScope) {
                    total += story.storyPoints;
                }
            }
            for (var project in stories) {
                stories[project].forEach(sumSP);
            }
            return total;
        };
        
        $scope.isRemaining = function(story) {
            return !story.sprint;
        };
    });
