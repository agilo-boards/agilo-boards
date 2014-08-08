'use strict';

angular.module('scrumboards')
.directive('ownerImage', function () {
    return {
        restrict: 'E',
        template: '<img src="{{imagePath}}" ng-hide="!imagePath"/>',
        scope: {
            owner: '@'
        },
        link: function($scope) {
            if ($scope.owner) {
                $scope.imagePath = 'images/team/' + $scope.owner + '.jpg';
            }
        }
    };
});