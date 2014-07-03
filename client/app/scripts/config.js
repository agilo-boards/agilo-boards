angular.module('agiloBoardsApp').constant('REST_API_URL', 'http://localhost:3000/agilo/eorders/report');
angular.module('agiloBoardsApp').constant('AGILO_URL', 'http://localhost:3000/agilo/eorders');
angular.module('agiloBoardsApp').constant('AGILO_REPORT_STORIES_AND_TASKS', {id: 0, type: 1, title: 2, release: 3, state: 4, owner: 5, keywords: 6, storyPoints: 7, timeDone: 8, timeRemaining: 9, sprint: 10, project: 11, parentId: 12});
angular.module('agiloBoardsApp').constant('AGILO_REPORT_RELEASES', {name: 0});
angular.module('agiloBoardsApp').constant('AGILO_REPORT_STORIES_BY_RELEASE', {id: 0, summary: 1, milestone: 2, status: 3, detailStatus: 4, keywords: 5, storyPoints: 6, sprint: 7, project: 8});
