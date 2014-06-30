'use strict';

describe('Service: Agilo Service', function () {

    // load the controller's module
    beforeEach(module('agiloBoardsApp'));

    var agilo, httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_Agilo_, _$httpBackend_) {
        agilo = _Agilo_;
        httpBackend = _$httpBackend_;

        httpBackend.whenGET('https://ci2.samw24.bluewin.ch/agilo/eorders/report/104?format=tab').respond(SprintsData.default);
    }));
    
    describe('Get all sprints', function () {
        it('should', function () {
            agilo.getSprints().then(function(result) {
                
            });
            httpBackend.flush();
        });
    });
});

