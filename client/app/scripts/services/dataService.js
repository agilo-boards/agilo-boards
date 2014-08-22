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

    return {
        getSprints: AgiloService.getSprints,        
        getOngoingSprints: function () {
            return this.getSprints().then(function (result) {
                var now = new Date();
                var filteredSprints = result.data.filter(function(sprint) {
                    return sprint.start <= now && now <= sprint.end;
                });
                return {
                    data: filteredSprints
                };
            });
        },
        getStoriesBySprint: function (selectedSprint) {
            var storiesAndTasks = AgiloService.getStoriesBySprint(selectedSprint);
            return storiesAndTasks.then(groupTasksByStory);
        },
        getReleases: AgiloService.getReleases,
        getStoriesByRelease: function (selectedRelease) {
            var stories = AgiloService.getStoriesByRelease(selectedRelease);
            return stories.then(groupStoriesByProject);
        }
    };
});