'use strict';

angular.module('scrumboards.agiloServices')
.service('AgiloService', function (AgiloUnformattedService, KeywordParser, TsvToJsonConverter, AGILO_REPORT_MAPPING_SPRINTS, AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, AGILO_REPORT_MAPPING_RELEASES, AGILO_REPORT_MAPPING_STORIES_BY_RELEASE, AGILO_REPORT_MAPPING_ADMIN_PROJECT_RATIO_BY_RELEASE) {
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

    function parseFloatOrNull(value) {
        var float = parseFloat(value);
        if (float >= 0 || float < 0) {
            return float;
        }
        return null;
    }

    function parseFloatOrZero(value) {
        var float = parseFloat(value);
        if (float) {
            return float;
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
        getSprintsByRelease : function (selectedRelease) {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getSprintsByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_MAPPING_SPRINTS, {
                start: parseDateFromUnixTimestamp,
                end: parseDateFromUnixTimestamp
            });
        },
        getStoriesBySprint: function (selectedSprint) {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getStoriesBySprint({ SPRINT: selectedSprint }), AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT, {
                keywords: parseKeywords,
                timeRemaining: parseFloatOrNull,
                timeDone: parseFloatOrZero,
                storyPoints: parseFloatOrNull,
                numberOfTasks: parseFloatOrNull,
                seqNumber: parseFloatOrNull
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
                keywords: parseKeywords,
                storyPoints: parseFloatOrNull,
                seqNumber: parseFloatOrNull                
            });
        },
        getAdminProjectRatioByRelease: function (selectedRelease) {
            return TsvToJsonConverter.deferredConversion(AgiloUnformattedService.getAdminProjectRatioByRelease({ MILESTONE: selectedRelease }), AGILO_REPORT_MAPPING_ADMIN_PROJECT_RATIO_BY_RELEASE, {
            	work_done: parseFloatOrNull            
            });
        }
    };
});