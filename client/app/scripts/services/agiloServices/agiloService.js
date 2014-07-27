'use strict';

angular.module('scrumboards.agiloServices')
.service('AgiloService', function (AgiloUnformattedService, KeywordParser, TsvToJsonConverter, AGILO_REPORT_MAPPING_SPRINTS, AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, AGILO_REPORT_MAPPING_RELEASES, AGILO_REPORT_MAPPING_STORIES_BY_RELEASE) {
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

    function parseHoursOrInvalid(value) {
        var hours = parseFloat(value);
        if (hours>=0) {
            return hours;
        }
        return null;
    }

    function parseHours(value) {
        var hours = parseFloat(value);
        if (hours) {
            return hours;
        }
        return 0;
    }

    return {
        getSprints: function () {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getSprints({}), AGILO_REPORT_MAPPING_SPRINTS, {
                start: parseDateFromUnixTimestamp,
                end: parseDateFromUnixTimestamp
            });
        },
        getStoriesBySprint: function (selectedSprint) {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getStoriesBySprint({ SPRINT: selectedSprint }), AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, {
                keywords: parseKeywords,
                timeRemaining: parseHoursOrInvalid,
                timeDone: parseHours
            });
        },
        getReleases: function () {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getReleases({}), AGILO_REPORT_MAPPING_RELEASES, {
                dueDate: parseDateFromUnixTimestampInMicroseconds,
                completedDate: parseDateFromUnixTimestampInMicroseconds
            });
        },
        getStoriesByRelease: function (selectedRelease) {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getStoriesByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_MAPPING_STORIES_BY_RELEASE, {
                keywords: parseKeywords
            });
        }
    };
});