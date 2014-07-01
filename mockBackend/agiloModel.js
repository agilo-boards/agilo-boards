var SPRINT_FIELDS = ['description', 'sprint_end', 'milestone', 'name', 'start', 'team'];

var sprints = [
    {
        description: 'First Sprint',
        sprint_end: 1405677600,
        milestone: 'Release 1.3',
        name: 'Sprint 1',
        start: 1402005600,
        team: 'A-Team'
    },
    {
        description: 'Second Sprint',
        sprint_end: 1403820000,
        milestone: 'Release 1.3',
        name: 'Sprint 2',
        start: 1402005600,
        team: 'A-Team'
    },
    {
        description: 'Third Sprint',
        sprint_end: 1405634400,
        milestone: 'Release 1.3',
        name: 'Sprint 3',
        start: 1402005600,
        team: 'A-Team'
    }
];

var TYPE_STORY = 'story';
var TYPE_TASK = 'task';
var MILESTONE_1 = 'Release 1';
var STATUS_ASSIGNED = 'assigned';
var STATUS_CLOSED = 'closed';
var STATUS_NEW = 'new';
var STATUS_REOPENED = 'reopened';
var STORY_AND_TASK_FIELDS = ['id', 'type', 'summary', 'milestone', 'status', 'owner', 'keywords', 'Story Points', 'Work done', 'Remaining time', 'Sprint', 'Project', 'Story ID'];
var SPRINT_1 = sprints[0].name;
var SPRINT_2 = sprints[1].name;
var SPRINT_3 = sprints[2].name;
var PROJECT = 'Agilo Boards';

var storiesAndTasks = [
    {
        id: 1100,
        type: TYPE_STORY,
        summary: 'Write unit tests',
        milestone: MILESTONE_1,
        status: STATUS_CLOSED,
        owner: 'amy',
        keywords: '[testing]',
        'Story Points': 3,
        Sprint: SPRINT_1,
        Project: PROJECT
    },
    {
        id: 1000,
        type: TYPE_STORY,
        summary: 'Implement dummy backend',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'face',
        keywords: '[testing]',
        'Story Points': 2,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1001,
        type: TYPE_STORY,
        summary: 'Set up AngularJS project',
        milestone: MILESTONE_1,
        status: STATUS_CLOSED,
        owner: 'amy',
        keywords: '[before camp]',
        'Story Points': 2,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1002,
        type: TYPE_STORY,
        summary: 'Convert existing jQuery code to AngularJS',
        milestone: MILESTONE_1,
        status: STATUS_CLOSED,
        owner: 'amy',
        keywords: '[before camp]',
        'Story Points': 2,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1003,
        type: TYPE_STORY,
        summary: 'Add testwatch target',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'amy',
        keywords: '[infrastructure]',
        'Story Points': 1,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1004,
        type: TYPE_STORY,
        summary: 'Read JavaScript book',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[education]',
        'Story Points': 2,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1005,
        type: TYPE_STORY,
        summary: 'Update time remaining',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        owner: 'face',
        keywords: '[important]',
        'Story Points': 3,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1006,
        type: TYPE_STORY,
        summary: 'Drag and drop',
        milestone: MILESTONE_1,
        status: STATUS_REOPENED,
        keywords: '[usability]',
        'Story Points': 1,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 1007,
        type: TYPE_STORY,
        summary: 'Focus on a person during daily',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        owner: 'face',
        keywords: '[important]',
        'Story Points': 3,
        Sprint: SPRINT_2,
        Project: PROJECT
    },
    {
        id: 2000,
        type: TYPE_TASK,
        summary: 'Serve static agilo reports',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'face',
        keywords: '[testing]',
        'Work done': 2.5,
        'Remaining time': 1,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1000
    },
    {
        id: 2001,
        type: TYPE_TASK,
        summary: 'Mock update time remaining',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        owner: 'face',
        keywords: '[testing]',
        'Work done': 0,
        'Remaining time': 2.5,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1000
    },
    {
        id: 2002,
        type: TYPE_TASK,
        summary: 'Read intro',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[education]',
        'Remaining time': 5,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1004
    },
    {
        id: 2003,
        type: TYPE_TASK,
        summary: 'Read chapter 1',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[testing]',
        'Work done': 2,
        'Remaining time': 10,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1004
    },
    {
        id: 2004,
        type: TYPE_TASK,
        summary: 'Read chapter 2',
        milestone: MILESTONE_1,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[education]',
        'Remaining time': 8,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1004
    },
    {
        id: 2005,
        type: TYPE_TASK,
        summary: 'Create new AngularJS project using Yeoman',
        milestone: MILESTONE_1,
        status: STATUS_CLOSED,
        owner: 'amy',
        keywords: '[testing]',
        'Work done': 2,
        Sprint: SPRINT_2,
        Project: PROJECT,
        'Story ID': 1001
    },
    {
        id: 3000,
        type: TYPE_STORY,
        summary: 'Add post-it to story',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        keywords: '[story mapping]',
        'Story Points': 4,
        Sprint: SPRINT_3,
        Project: PROJECT
    },
    {
        id: 3001,
        type: TYPE_STORY,
        summary: 'Drag and drop post-it',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        keywords: '[story mapping]',
        'Story Points': 2,
        Sprint: SPRINT_3,
        Project: PROJECT
    },
    {
        id: 2050,
        type: TYPE_TASK,
        summary: 'Implement drag and drop',
        milestone: MILESTONE_1,
        status: STATUS_NEW,
        'Remaining time': 12,
        Sprint: SPRINT_3,
        Project: PROJECT,
        'Story ID': 3001
    }
];


function getRow(sprint, fields) {
    return fields.map(function (field) {
        return sprint[field];
    }).join('\t');
};

function asTsv(data, fields) {
    return fields.join('\t') + '\n' + data.map(function (row) {
        return getRow(row, fields);
    }).join('\n');
}

function getStoriesAndTasksForSprint(sprint) {
    return storiesAndTasks.filter(function (storyOrTask) {
        return  storyOrTask.Sprint === sprint;
    });
}

module.exports.getStoriesAndTasksAsInReport103 = function (sprint) {
    return asTsv(getStoriesAndTasksForSprint(sprint), STORY_AND_TASK_FIELDS);
}

module.exports.getSprintsAsInReport104 = function () {
    return asTsv(sprints, SPRINT_FIELDS);
};