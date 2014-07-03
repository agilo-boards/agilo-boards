'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function ($q, AgiloUnformatted, AGILO_REPORT_STORIES_AND_TASKS, AGILO_REPORT_STORIES_BY_RELEASE) {

        function transformTSVtoJSON(serviceCall, params, mapToObject) {
            var deferredResult = $q.defer();
            serviceCall(params).then(function (result) {
                var rows = result.data.split('\n');
                if (rows && rows[0]) {
                    rows.splice(0, 1);
                    rows = rows.filter(function (row) {
                        return row.trim().length > 0;
                    });
                }
                deferredResult.resolve({
                    data: rows.map(function (row) {
                        var columns = row.split('\t');
                        return mapToObject(columns);
                    })
                });
            }, function (error) {
                deferredResult.reject(error);
            });
            return deferredResult.promise;
        }

        function createConversionMethod(conversionMap) {
            return function (columns) {
                var item = {};
                angular.forEach(conversionMap, function (value, key) {
                    if (typeof columns[value] === 'undefined') {
                        return;
                    }
                    item[key] = columns[value].trim();
                });
                return item;
            };
        }

        return {
            getSprintNames: function () {
                return transformTSVtoJSON(AgiloUnformatted.getSprints, {}, function (columns) {
                    return columns[3].trim();
                });
            },
            getSprints: function () {
                return transformTSVtoJSON(AgiloUnformatted.getSprints, {}, function (columns) {
                    return {
                        description: columns[0].trim(),
                        end: (columns[1].trim()) ? new Date(columns[1].trim() * 1000) : null,
                        milestone: columns[2].trim(),
                        name: columns[3].trim(),
                        start: (columns[4].trim()) ? new Date(columns[4].trim() * 1000) : null,
                        team: columns[5].trim()
                    };
                });
            },
            getStoriesBySprint: function (selectedSprint) {
                var deferredResult = $q.defer();
                var storiesAndTasks = transformTSVtoJSON(AgiloUnformatted.getStoriesBySprint, { SPRINT: selectedSprint }, createConversionMethod(AGILO_REPORT_STORIES_AND_TASKS));
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
                        stories: stories
                    });
                }, function (error) {
                    deferredResult.reject(error);
                });
                return deferredResult.promise;
            },
            getReleases: function () {
                return transformTSVtoJSON(AgiloUnformatted.getReleases, {}, function (columns) {
                    return {
                        name: columns[0].trim(),
                        dueDate: (columns[1].trim()) ? new Date(columns[1].trim() / 1000) : null,
                        completedDate: (columns[2].trim()) ? new Date(columns[2].trim() / 1000) : null,
                        description: columns[3].trim()
                    };
                });
            },
            getStoriesByRelease: function (selectedRelease) {
                var deferredResult = $q.defer();
                var stories = transformTSVtoJSON(AgiloUnformatted.getStoriesByRelease, { MILESTONE: selectedRelease }, createConversionMethod(AGILO_REPORT_STORIES_BY_RELEASE));
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