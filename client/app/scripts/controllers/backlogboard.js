'use strict';

angular.module('scrumboards')
    .controller('BacklogboardCtrl', function ($scope, $filter, $location, $window, DataService, UpdateTicketService, Synchronizer, MessageService) {
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
            
            var sprintPromise = DataService.getSprintsByRelease($scope.selectedRelease.name);
            sprintPromise.then(function (sprints) {
                $scope.sprints = sprints.data;
                $scope.$emit('sprintsLoaded');
            });
        });
        
        $scope.reload = function () {
            $scope.$emit('reloadBoard');
        };

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
        
        function determineSeqNumber(story, draggedOver) {
            if (!draggedOver || !$scope.storyMap[draggedOver.storyId]) {
                return undefined;
            }
            var draggedOverStory = $scope.storyMap[draggedOver.storyId];
            var draggedOverSeqNumber = parseInt(draggedOverStory.seqNumber);
            if (!draggedOverSeqNumber) {
                draggedOverSeqNumber = 100;
                UpdateTicketService.switchSeqNumber(story, 100, function () {
                    $scope.$emit('reloadBoard');
                });
            }
            if (draggedOver.upperHalf) {
                return draggedOverSeqNumber+1;
            } else {
                return draggedOverSeqNumber-1;
            }
            
        }
        $scope.$on('story-dragged', function (e, src, dest, storyId, draggedOver) {
            var story = $scope.storyMap[storyId];
            var sprint = dest.getAttribute('sprint');
            var seqNumber = determineSeqNumber(story, draggedOver);
            UpdateTicketService.switchSprintAndSeqNumber(story, sprint, seqNumber, function () {
                $scope.$emit('reloadBoard');
            }, function (error) {
                $('#messageContainer').append(MessageService.error(error, 'Unable to modify ticket.', 'Make sure you are logged in to modify tickets.'));
            });
		});
    });
