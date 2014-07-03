'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function ($q, AgiloUnformatted, TSVtoJSONConverter, AGILO_REPORT_SPRINTS, AGILO_REPORT_STORIES_AND_TASKS, AGILO_REPORT_RELEASES, AGILO_REPORT_STORIES_BY_RELEASE) {

        function parseKeywords(keywordsStr) {
            if ((keywordsStr.indexOf('[') === 0) && (keywordsStr.lastIndexOf(']') === keywordsStr.length-1)) {
                keywordsStr = keywordsStr.substring(1, keywordsStr.length-1);
            }
            var keywords = keywordsStr.split(',');
            function keywordNotEmpty(keyword) {
                return keyword.length > 0;
            }
            function trimKeyword(keyword) {
                return keyword.trim();
            }
            function shortenKeyword(keyword) {
                if (keyword.length > 9) {
                    return keyword.substr(0, 8)+'..';
                }
                return keyword;
            }
            return keywords.map(shortenKeyword).map(trimKeyword).filter(keywordNotEmpty);
        }
        
        function parseDate(date) {
            return new Date(date*1000);
        }

        return {
            getSprints: function () {
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getSprints({}), AGILO_REPORT_SPRINTS, {
                    start: parseDate
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
                return TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getReleases({}), AGILO_REPORT_RELEASES);
            },
            getStoriesByRelease: function (selectedRelease) {
                var deferredResult = $q.defer();
                var stories = TSVtoJSONConverter.deferredConversion(AgiloUnformatted.getStoriesByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_STORIES_BY_RELEASE);
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