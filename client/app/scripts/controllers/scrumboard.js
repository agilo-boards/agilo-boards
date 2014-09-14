'use strict';

angular.module('scrumboards')
    .controller('ScrumboardCtrl', function ($scope, $rootScope, $location, $window, LinkProvider, Synchronizer, TimeHelper, DataService, ObjToArrayConverter) {
        
        var sprints = DataService.getOngoingSprints();
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
        Synchronizer.syncToLocalStorage($scope, 'hideUnknownKeywords', { isBoolean: true });
        Synchronizer.syncToLocalStorage($scope, 'ownerMode', { isBoolean: true });
        var ScrumboardCtrl = this;
        Synchronizer.syncToLocalStorage($scope, 'selectedOwner', { callback: function (value) {
            ScrumboardCtrl.selectedOwner = value;
        }});

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

        function notMatchingSelectedOwner(ticket) {
            if (!$scope.ownerMode) {
                return false;
            }
            return ticket.owner !== $scope.selectedOwner;
        }
        $scope.fadedOutStory = notMatchingSelectedOwner;

        $scope.fadedOutTask = function (task, story) {
            if (task.owner) {
                return notMatchingSelectedOwner(task);
            }
            return notMatchingSelectedOwner(story);
        };

        $scope.orderBySelectedOwner = function (story) {
            if ($scope.ownerMode && notMatchingSelectedOwner(story)) {
                if (story.tasks.every(notMatchingSelectedOwner)) {
                    return 2;
                } else {
                    return 1;
                }
            } else {
                return 0;
            }
        };
        
        $scope.isNotFilteredByKeyword = function(story) {
            return !story.containsAnyFilteredKeywordTypes($scope.keywordTypes);
        };
    });
