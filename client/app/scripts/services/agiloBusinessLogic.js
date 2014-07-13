'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function ($q, AgiloUnformatted, KeywordParser, TSVtoJSONConverter, AGILO_REPORT_MAPPING_SPRINTS, AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, AGILO_REPORT_MAPPING_RELEASES, AGILO_REPORT_MAPPING_STORIES_BY_RELEASE) {
        function parseKeywords(keywords) {
            return KeywordParser.parse(keywords);
        }

        function parseDateFromUnixTimestamp(date) {
            if (!date) {
                return null;
            }
            return new Date(date * 1000);
        }

        function parseDateFromUnixTimestampInMicroseconds(date) {
            if (!date) {
                return null;
            }
            return new Date(date / 1000);
        }

        return {
            getSprints: function () {
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getSprints({}), AGILO_REPORT_MAPPING_SPRINTS, {
                    start: parseDateFromUnixTimestamp,
                    end: parseDateFromUnixTimestamp
                });
            },
            getStoriesBySprint: function (selectedSprint) {
                var deferredResult = $q.defer();
                var storiesAndTasks = TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getStoriesBySprint({ SPRINT: selectedSprint }), AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, {
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
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getReleases({}), AGILO_REPORT_MAPPING_RELEASES, {
                    dueDate: parseDateFromUnixTimestampInMicroseconds,
                    completedDate: parseDateFromUnixTimestampInMicroseconds
                });
            },
            getStoriesByRelease: function (selectedRelease) {
                var deferredResult = $q.defer();
                var stories = TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getStoriesByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_MAPPING_STORIES_BY_RELEASE, {
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