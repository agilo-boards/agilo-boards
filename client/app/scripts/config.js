angular.module('agiloBoardsApp').constant('AGILO_URL', 'http://localhost:3000/agilo/eorders');
angular.module('agiloBoardsApp').constant('AGILO_REPORTS', { sprints: '/104', storiesAndTasksBySprint: '/103', releases: '/108', storiesByRelease: '/109' });
angular.module('agiloBoardsApp').constant('AGILO_REPORT_MAPPING_SPRINTS', { description: 0, end: 1, milestone: 2, name: 3, start: 4, team: 5 });
angular.module('agiloBoardsApp').constant('AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT', {id: 0, type: 1, title: 2, release: 3, status: 4, owner: 5, keywords: 6, storyPoints: 7, timeDone: 8, timeRemaining: 9, sprint: 10, project: 11, parentId: 12});
angular.module('agiloBoardsApp').constant('AGILO_REPORT_MAPPING_RELEASES', {name: 0, dueDate: 1, completedDate: 2, description: 3});
angular.module('agiloBoardsApp').constant('AGILO_REPORT_MAPPING_STORIES_BY_RELEASE', {id: 0, title: 1, release: 2, status: 3, detailStatus: 4, keywords: 5, storyPoints: 6, sprint: 7, project: 8});
angular.module('agiloBoardsApp').constant('AGILO_KEYWORDS', [
    {
        regex: /on hold/gi,
        color: 'red'
    },
    {
        regex: /clean[- ]?up/gi,
        color: 'orange'
    },
    {
        regex: /depends on/gi,
        color: 'green'
    },
    {
        regex: /importan/gi,
        color: 'blue'
    }
]);