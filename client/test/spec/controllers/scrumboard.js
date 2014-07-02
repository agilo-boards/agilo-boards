'use strict';

describe('Controller: ScrumboardCtrl', function () {

    // load the controller's module
    beforeEach(module('agiloBoardsApp'));

    var ScrumboardCtrl,
        $scope;

    // Initialize the controller and a mock $scope
    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        ScrumboardCtrl = $controller('ScrumboardCtrl', {
            $scope: $scope
        });
    }));

    describe('isStoryClosable', function () {
        it('returns true for stories that have sate "assigned"', function () {
            expect($scope.isStoryClosable({state: 'assigned'})).toBeTruthy();
        });

        it('returns false for stories that have any other state', function () {
            expect($scope.isStoryClosable({state: 'closed'})).toBeFalsy();
            expect($scope.isStoryClosable({state: 'new'})).toBeFalsy();
            expect($scope.isStoryClosable({state: 'reopened'})).toBeFalsy();
        });
    });

});
