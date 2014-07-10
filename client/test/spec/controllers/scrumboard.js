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

});
