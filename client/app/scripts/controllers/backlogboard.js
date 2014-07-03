'use strict';

angular.module('agiloBoardsApp')
    .controller('BacklogboardCtrl', function ($scope, $location, $window, Agilo) {
        var releasePromise = Agilo.getReleases();
        
        $scope.$watch('selectedRelease', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $location.search('release', newValue.name);
            }
        });
        releasePromise.then(function (releases) {
            var selectedRelease = $location.search()['release'];
            if (selectedRelease) {
                var selectedReleasesArray = releases.data.filter(function(element) {
                    return element.name === selectedRelease;
                });
                $scope.selectedRelease = selectedReleasesArray[0];
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
            loadStories($scope.selectedRelease);
        };

        function loadStories(selectedRelease) {
            var storiesPromise = Agilo.getStoriesByRelease(selectedRelease.name);
            storiesPromise.then(function (result) {
                $scope.projects = result.projects;
                $scope.numberOfProjects = Object.keys($scope.projects).length;
            }, function (error) {
                $('#messageContainer').append('<div class="error">' + error + '</div>');
            });
        }
        
        $scope.isRemainingStory = function(story) {
            if ('Ready to Implement' === story.detailStatus || 'Next Sprint' === story.detailStatus) {
                return false;
            }
            return true;
        };

    });
