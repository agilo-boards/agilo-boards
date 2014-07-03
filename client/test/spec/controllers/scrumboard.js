'use strict';

describe('Controller: ScrumboardCtrl', function () {

    // load the controller's module
    beforeEach(module('agiloBoardsApp'));

    var ScrumboardCtrl,
        $scope,
        UpdateTicketService;

    // Initialize the controller and a mock $scope
    beforeEach(inject(function ($controller, $rootScope, _UpdateTicketService_) {
        $scope = $rootScope.$new();
        UpdateTicketService = _UpdateTicketService_;
        ScrumboardCtrl = $controller('ScrumboardCtrl', {
            $scope: $scope,
            UpdateTicketService: UpdateTicketService
        });
    }));

    describe('isStoryClosable', function () {
        it('returns true for stories that have sate "assigned"', function () {
            expect($scope.isStoryClosable({status: 'assigned'})).toBeTruthy();
        });

        it('returns false for stories that have any other state', function () {
            expect($scope.isStoryClosable({status: 'closed'})).toBeFalsy();
            expect($scope.isStoryClosable({status: 'new'})).toBeFalsy();
            expect($scope.isStoryClosable({status: 'reopened'})).toBeFalsy();
        });
    });

    describe('closeTicket', function () {
        it('calls the UpdateTicketService', function () {
            var ticket = {id: '1234'};
            spyOn(UpdateTicketService, 'closeTicket');
            $scope.closeTicket(ticket);
            expect(UpdateTicketService.closeTicket).toHaveBeenCalledWith(ticket);
        });
    });

});
