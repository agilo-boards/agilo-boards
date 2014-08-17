'use strict';

describe('Directive: Story', function () {

    // load the controller's module
    beforeEach(module('scrumboards'));

    var scope,
        UpdateTicketService,
        elem,
        httpBackend,
        controller;

    // Initialize the controller and a mock $scope
    beforeEach(inject(function ($controller, $rootScope, _UpdateTicketService_, $compile, _$httpBackend_) {
        scope = $rootScope.$new();
        scope.story = { id: 1234 };
        UpdateTicketService = _UpdateTicketService_;        
        httpBackend = _$httpBackend_;
        
        var html = '<story story="story"></story>';
        httpBackend.whenGET('templates/story.html').respond('<div>Story</div>');
        elem = $compile(html)(scope);
        scope.$digest();
        httpBackend.flush();
        scope = elem.isolateScope();
        
    }));

    describe('isStoryClosable', function () {
        it('returns true for stories that have sate "assigned"', function () {
            controller = elem.controller('agiloStory');
            expect(scope.isStoryClosable({status: 'assigned'})).toBeTruthy();
        });

        it('returns false for stories that have any other state', function () {
            expect(scope.isStoryClosable({status: 'closed'})).toBeFalsy();
            expect(scope.isStoryClosable({status: 'new'})).toBeFalsy();
            expect(scope.isStoryClosable({status: 'reopened'})).toBeFalsy();
        });
    });

    describe('closeTicket', function () {
        it('calls the UpdateTicketService', function () {
            var ticket = {id: '1234'};
            spyOn(UpdateTicketService, 'closeTicket');
            scope.closeTicket(ticket);
            expect(UpdateTicketService.closeTicket.mostRecentCall.args[0]).toEqual(ticket);
        });
    });

    describe('initialization', function () {
        it('sets the id on the element', function () {
            expect(elem.attr('id')).toEqual('story-1234');
            expect(elem.attr('story-id')).toEqual('1234');
        });
    });
});
