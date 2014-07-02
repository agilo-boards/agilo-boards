'use strict';

describe('Service: Agilo Service', function () {

    // load the controller's module
    beforeEach(module('agiloBoardsApp'));

    var agilo, httpBackend, TestData;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_Agilo_, _$httpBackend_, _TestData_) {
        agilo = _Agilo_;
        httpBackend = _$httpBackend_;
        TestData = _TestData_;

        httpBackend.whenGET('http://localhost:3000/agilo/eorders/report/104?format=tab').respond(TestData.SPRINTS);
        httpBackend.whenGET('http://localhost:3000/agilo/eorders/report/103?max=500&format=tab&SPRINT=Sprint+2').respond(TestData.STORIES_AND_TASKS_SPRINT_2);
    }));

    describe('Get all sprints', function () {
        it('should ignore the title line', function () {
            agilo.getSprintNames().then(function (result) {
                expect(result.data.length).toBe(3);
                expect(result.data[0]).toBe('Sprint 1');
            });
            httpBackend.flush();
        });
    });

    describe('Get all stories and tasks', function () {
        it('should map the stories correctly', function () {
            agilo.getStoriesBySprint('Sprint 2').then(function (result) {
                expect(result.stories[1000]).toBeDefined();
                expect(result.stories[1004].tasks.length).toBe(3);
                expect(result.stories[1007]).toBeDefined();
            });
            httpBackend.flush();
        });
    });
});

