'use strict';

angular.module('scrumboards')
    .controller('BacklogboardCtrl', function ($scope, $location, $window, DataService, UpdateTicketService) {
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
                $scope.projects = result.projects;
                $scope.storyMap = {};
                function addStoryToMap(story) {
                    $scope.storyMap[story.id] = story;
                }
                for (var project in $scope.projects) {
                    $scope.projects[project].forEach(addStoryToMap);
                }
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


    });
