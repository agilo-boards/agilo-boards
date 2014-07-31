'use strict';

angular.module('scrumboards')
    .controller('BacklogboardCtrl', function ($scope, $filter, $location, $window, DataService, UpdateTicketService) {
        $scope.nextSprintStories = {};
        $scope.readyToImplementStories = {};
        $scope.remainingStories = {};
        
        var releasePromise = DataService.getReleases();
        $scope.$watch('selectedRelease', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $location.search('release', newValue.name);
                localStorage.setItem('selectedRelease', newValue.name);
            }
        });
        releasePromise.then(function (releases) {
            var selectedRelease = $location.search()['release'] || localStorage.getItem('selectedRelease');
            if (selectedRelease) {
                $scope.selectedRelease = releases.data.filter(function(element) {
                    return element.name === selectedRelease;
                })[0];
            }
            if (!$scope.selectedRelease && releases.data[0]) {
                $scope.selectedRelease = releases.data[0];
            }
            $scope.allReleases = releases.data;
            loadStories($scope.selectedRelease);

        }, function (error) {
            $('#messageContainer').append('<div class="error">' + error + '</div>');
        });
        
        $scope.reload = function () {
            $scope.$emit('reloadBoard');
        };
        $scope.$on('reloadBoard', function () {
            loadStories($scope.selectedRelease);
        });
        
        function loadStories(selectedRelease) {
            var storiesPromise = DataService.getStoriesByRelease(selectedRelease.name);
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
        }
        
        
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
    });
