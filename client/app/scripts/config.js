angular.module('scrumboards.config', [])
.constant('AGILO_URL', 'http://localhost:3000/agilo/eorders')
.constant('AGILO_REPORTS', { sprints: '/104', storiesAndTasksBySprint: '/103', releases: '/108', storiesByRelease: '/109', adminProjectRatioByRelease: '/122' })
.constant('AGILO_REPORT_MAPPING_SPRINTS', { description: 0, end: 1, milestone: 2, name: 3, start: 4, team: 5 })
.constant('AGILO_REPORT_MAPPING_STORIES_AND_TASKS_BY_SPRINT', {id: 0, type: 1, title: 2, release: 3, status: 4, owner: 5, keywords: 6, storyPoints: 7, timeDone: 8, timeRemaining: 9, sprint: 10, project: 11, parentId: 12, seqNumber: 13})
.constant('AGILO_REPORT_MAPPING_RELEASES', {name: 0, dueDate: 1, completedDate: 2, description: 3})
.constant('AGILO_REPORT_MAPPING_STORIES_BY_RELEASE', {id: 0, title: 1, release: 2, status: 3, detailStatus: 4, keywords: 5, storyPoints: 6, sprint: 7, project: 8, seqNumber: 9, inScope: 10, numberOfTasks: 11})
.constant('AGILO_REPORT_MAPPING_ADMIN_PROJECT_RATIO_BY_RELEASE', {category: 0, work_done: 1, share: 2})
.constant('AGILO_KEYWORDS', [
    {
        type:  'on hold',
        regex: /on hold/gi,
        color: 'red'
    },
    {
        type:  'clean up',
        regex: /clean[- ]?up/gi,
        color: 'orange'
    },
    {
        type:  'depends on',
        regex: /depends on/gi,
        color: 'green'
    },
    {
        type:  'important',
        regex: /importan/gi,
        color: 'blue'
    }
]);