'use strict';

angular.module('scrumboards')
.service('DataService', function (AgiloService, Story, Task) {
        
    function groupStoriesByProject(items) {
        var projects = {};
        items.data.forEach(function (item) {
            if (!projects.hasOwnProperty(item.project)) {
                projects[item.project] = [];
            }
            projects[item.project].push(Story.new(item));
        });
        return {
            projects: projects
        };
    }
    
    function groupTasksByStory(items) {
        var stories = {};
        items.data.forEach(function (item) {
            if (item.type === 'story') {
                stories[item.id] = Story.new(item);
                stories[item.id].tasks = items.data.filter(function (otherItem) {
                    return otherItem.type === 'task' && otherItem.parentId === item.id;
                }).map(Task.new);
            }
        });
        return {
            data: stories
        };
    }
    
    function addWeeks(date, weeks) {
        var result = new Date(date);
        result.setDate(date.getDate() + 7 * weeks);
        return result;
    }

    return {
        getSprints: AgiloService.getSprints,        
        getOngoingSprints: function () {
            return this.getSprints().then(function (result) {
                var now = new Date();
                var filteredSprints = result.data.filter(function(sprint) {
                    return addWeeks(sprint.start, -2) <= now && now <= addWeeks(sprint.end, 2);
                });
                return {
                    data: filteredSprints
                };
            });
        },
        getSprintsByRelease: function (selectedRelease) {
            return AgiloService.getSprintsByRelease(selectedRelease);
        },
        getStoriesBySprint: function (selectedSprint) {
            var storiesAndTasks = AgiloService.getStoriesBySprint(selectedSprint);
            return storiesAndTasks.then(groupTasksByStory);
        },
        getReleases: AgiloService.getReleases,
        getStoriesByRelease: function (selectedRelease) {
            var stories = AgiloService.getStoriesByRelease(selectedRelease);
            return stories.then(groupStoriesByProject);
        },
        getAdminProjectRatioByRelease: function (selectedRelease) {
        	var adminProjectRatio = AgiloService.getAdminProjectRatioByRelease(selectedRelease);
        	return adminProjectRatio.then(function (result) {
        		var ratio = {};
        		var data = result.data;
        		var dataLength = data.length;
        		for (var i = 0; i < dataLength; i++) {
        			ratio[data[i].category] = data[i].share;
        		}
        		return ratio;
        	});
        }
    };
});