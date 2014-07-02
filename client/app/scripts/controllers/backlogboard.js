'use strict';

angular.module('agiloBoardsApp')
    .controller('BacklogboardCtrl', function ($scope, $location, $window, Agilo, AGILO_URL) {
         var releasePromise = Agilo.getReleases();
        $scope.releases = {
            selectedRelease: $location.search()['release']
        };
        $scope.$watch('releases.selectedRelease', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $location.search('release', newValue);
            }
        });
        releasePromise.then(function (releases) {
            if (!$scope.releases.selectedReleases && releases.data[0]) {
                $scope.releases.selectedReleases = releases.data[0];
            }
            $scope.releases.allReleases = releases.data;
            loadReleases($scope.release.selectedRelease);

        }, function (error) {
            $('#messageContainer').append('<div class="error">' + error + '</div>');
        });
        
        function loadReleases(selectedRelease) {
            var storiesPromise = Agilo.getStoriesByRelease(selectedRelease);
            storiesPromise.then(function (result) {
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
        
       
    });
