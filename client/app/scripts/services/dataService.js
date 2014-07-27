'use strict';

angular.module('scrumboards')
.service('DataService', function (AgiloService) {
        
    function groupStoriesByProject(items) {
        var projects = {};
        items.data.forEach(function (item) {
            if (!projects.hasOwnProperty(item.project)) {
                projects[item.project] = [];
            }
            projects[item.project].push(item);
        });
        return {
            projects: projects
        };
    }
    
    function groupTasksByStory(items) {
        var stories = {};
        items.data.forEach(function (item) {
            if (item.type === 'story') {
                stories[item.id] = item;
                stories[item.id].tasks = items.data.filter(function (otherItem) {
                    return otherItem.type === 'task' && otherItem.parentId === item.id;
                });
            }
        });
        return {
            data: stories
        };
    }

    return {
        getSprints: AgiloService.getSprints,
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