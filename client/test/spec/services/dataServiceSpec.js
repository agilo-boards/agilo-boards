'use strict';

describe('Service: Data Service', function () {

    // load the controller's module
    beforeEach(module('scrumboards'));

    var agilo, httpBackend, TestData;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_DataService_, _$httpBackend_, _TestData_) {
        agilo = _DataService_;
        httpBackend = _$httpBackend_;
        TestData = _TestData_;

        httpBackend.whenGET('http://localhost:3000/agilo/eorders/report/104?format=tab').respond(TestData.SPRINTS);
        httpBackend.whenGET('http://localhost:3000/agilo/eorders/report/103?max=500&format=tab&SPRINT=Sprint+2').respond(TestData.STORIES_AND_TASKS_SPRINT_2);
        httpBackend.whenGET('http://localhost:3000/agilo/eorders/report/122?max=100&format=tab&MILESTONE=Release%2B2015-03').respond(TestData.ADMIN_VS_PROJECT_RATION_RELEASE_2015_03);
    }));

    describe('Get all sprints', function () {
        it('should ignore the title line', function () {
            agilo.getSprints().then(function (result) {
                expect(result.data.length).toBe(3);
                expect(result.data[0].name).toBe('Sprint 1');
            });
            httpBackend.flush();
        });
    });

    describe('Get all stories and tasks', function () {
        it('should map the stories correctly', function () {
            agilo.getStoriesBySprint('Sprint 2').then(function (result) {
                expect(result.data[1000]).toBeDefined();
                expect(result.data[1004].tasks.length).toBe(3);
                expect(result.data[1007]).toBeDefined();
            });
            httpBackend.flush();
        });
    });
    
    describe('Get admin vs. project ratio', function () {
        it('should map the ratio correctly', function () {
        	agilo.getAdminProjectRatioByRelease('Release+2015-03').then(function (result) {
        		expect(result.admin).toBe('57.5%');
        		expect(result.projects).toBe('42.5%');
        	});
            httpBackend.flush();
        });
    });
});

