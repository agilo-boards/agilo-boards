'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function ($q, AgiloUnformatted, KeywordParser, TSVtoJSONConverter, AGILO_REPORT_SPRINTS, AGILO_REPORT_STORIES_AND_TASKS, AGILO_REPORT_RELEASES, AGILO_REPORT_STORIES_BY_RELEASE) {
        function parseKeywords(keywords) {
            // TODO
            //return KeywordParser.parse(keywords);
            return [keywords];
        }
        
        function parseDate(date) {
            return new Date(date*1000);
        }
        
        function parseDateMs(date) {
            if (!date || date===0) {
                return 0;
            }
            return new Date(date/1000);
        }

        return {
            getSprints: function () {
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getSprints({}), AGILO_REPORT_SPRINTS, {
                    start: parseDate,
                    end: parseDate
                });
            },
            getStoriesBySprint: function (selectedSprint) {
                var deferredResult = $q.defer();
                var storiesAndTasks = TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getStoriesBySprint({ SPRINT: selectedSprint }), AGILO_REPORT_STORIES_AND_TASKS, {
                    keywords: parseKeywords
                });
                storiesAndTasks.then(function (items) {
                    var stories = {};
                    items.data.forEach(function (item) {
                        if (item.type === 'story') {
                            stories[item.id] = item;
                            stories[item.id].tasks = items.data.filter(function (otherItem) {
                                return otherItem.type === 'task' && otherItem.parentId === item.id;
                            });
                        }
                    });
                    deferredResult.resolve({
                        data: stories
                    });
                }, function (error) {
                    deferredResult.reject(error);
                });
                return deferredResult.promise;
            },
            getReleases: function () {
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getReleases({}), AGILO_REPORT_RELEASES, {
                    dueDate: parseDateMs,
                    completedDate: parseDateMs
                });
            },
            getStoriesByRelease: function (selectedRelease) {
                var deferredResult = $q.defer();
                var stories = TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getStoriesByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_STORIES_BY_RELEASE, {
                    keywords: parseKeywords
                });
                stories.then(function (items) {
                    var projects = {};
                    items.data.forEach(function (item) {
                        if (!projects.hasOwnProperty(item.project)) {
                            projects[item.project] = [];
                        }
                        projects[item.project].push(item);
                    });
                    deferredResult.resolve({
                        projects: projects
                    });
                }, function (error) {
                    deferredResult.reject(error);
                });
                return deferredResult.promise;
            }
        };
    });