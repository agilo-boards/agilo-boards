'use strict';

angular.module('scrumboards')
    .controller('BacklogboardCtrl', function ($scope, $location, $window, DataService) {
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
            loadStories($scope.selectedRelease);
        };
        
        function loadStories(selectedRelease) {
            var storiesPromise = DataService.getStoriesByRelease(selectedRelease.name);
            storiesPromise.then(function (result) {
                $scope.projects = result.projects;
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
