'use strict';

var debug = require('debug')('mock-backend');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

var BEGIN_SPRINT_1_RELEASE_1 = addDays(getMonday(new Date()), -42);
var BEGIN_SPRINT_1_RELEASE_2 = addDays(BEGIN_SPRINT_1_RELEASE_1, 21);
var BEGIN_SPRINT_2_RELEASE_2 = addDays(BEGIN_SPRINT_1_RELEASE_2, 21);
var BEGIN_SPRINT_3_RELEASE_2 = addDays(BEGIN_SPRINT_2_RELEASE_2, 21);
var BEGIN_SPRINT_1_RELEASE_3 = addDays(BEGIN_SPRINT_3_RELEASE_2, 21);
var BEGIN_SPRINT_2_RELEASE_3 = addDays(BEGIN_SPRINT_1_RELEASE_3, 21);

var RELEASE_FIELDS = ['name', 'due', 'completed', 'description'];

var releases = [
    {
        name: 'Release 3',
        due: BEGIN_SPRINT_1_RELEASE_3.getTime() * 1000,
        completed: null,
        description: 'Software Delivery Date: 18.04.2014 (Fr) \\Release Date: 16.05.2014 (Fr)'
    },
    {
        name: 'Release 2',
        due: BEGIN_SPRINT_1_RELEASE_2.getTime() * 1000,
        completed: BEGIN_SPRINT_1_RELEASE_3.getTime() * 1000,
        description: 'Software Delivery: 24.01.2014[[BR]]  Release-Termin: 23.02.2014'
    },
    {
        name: 'Release 1',
        due: BEGIN_SPRINT_1_RELEASE_1.getTime() * 1000,
        completed: BEGIN_SPRINT_1_RELEASE_2.getTime() * 1000,
        description: 'Software Delivery: 24.01.2014[[BR]]  Release-Termin: 23.02.2014'
    }
];

var SPRINT_FIELDS = ['description', 'sprint_end', 'milestone', 'name', 'start', 'team'];

var sprints = [
    {
        description: 'First Sprint',
        sprint_end: BEGIN_SPRINT_1_RELEASE_2.getTime() / 1000,
        milestone: releases[0].name,
        name: 'Sprint 1',
        start: BEGIN_SPRINT_1_RELEASE_1.getTime() / 1000,
        team: 'A-Team'
    },
    {
        description: 'First Sprint',
        sprint_end: BEGIN_SPRINT_2_RELEASE_2.getTime() / 1000,
        milestone: releases[1].name,
        name: 'Sprint 1',
        start: BEGIN_SPRINT_1_RELEASE_2.getTime() / 1000,
        team: 'A-Team'
    },
    {
        description: 'Second Sprint',
        sprint_end: BEGIN_SPRINT_3_RELEASE_2.getTime() / 1000,
        milestone: releases[1].name,
        name: 'Sprint 2',
        start: BEGIN_SPRINT_2_RELEASE_2.getTime() / 1000,
        team: 'A-Team'
    },
    {
        description: 'Third Sprint',
        sprint_end: BEGIN_SPRINT_1_RELEASE_3.getTime() / 1000,
        milestone: releases[1].name,
        name: 'Sprint 3',
        start: BEGIN_SPRINT_3_RELEASE_2.getTime() / 1000,
        team: 'A-Team'
    },
    {
        description: 'First Sprint',
        sprint_end: BEGIN_SPRINT_2_RELEASE_3.getTime() / 1000,
        milestone: releases[2].name,
        name: 'Sprint 1',
        start: BEGIN_SPRINT_1_RELEASE_3.getTime() / 1000,
        team: 'A-Team'
    }
];

var STORY_FIELDS_FOR_BACKLOG = ['id', 'summary', 'milestone', 'status', 'Detail Status', 'keywords', 'Story Points', 'Sprint', 'Project'];

var STORY_AND_TASK_FIELDS = ['id', 'type', 'summary', 'milestone', 'status', 'owner', 'keywords', 'Story Points', 'Work done', 'Remaining time', 'Sprint', 'Project', 'Story ID'];

var TYPE_STORY = 'story';
var TYPE_TASK = 'task';
var RELEASE_1 = releases[0].name;
var RELEASE_2 = releases[1].name;
var RELEASE_3 = releases[2].name;
var STATUS_ASSIGNED = 'assigned';
var STATUS_CLOSED = 'closed';
var STATUS_NEW = 'new';
var STATUS_REOPENED = 'reopened';
var DETAIL_STATUS_NEXT_SPRINT = 'Next Sprint';
var DETAIL_STATUS_READY_TO_IMPLEMENT = 'Ready to Implement';
//var DETAIL_STATUS_DETAIL_ESTIMATION_DONE = 'Detail estimation done';
var DETAIL_STATUS_READY_FOR_DETAIL_ESTIMATION = 'Ready for rough estimation';
//var DETAIL_STATUS_ROUGH_ESTIMATION_DONE = 'Rough estimation done';
var DETAIL_STATUS_READY_FOR_ROUGH_ESTIMATION = 'Ready for rough estimation';
var DETAIL_STATUS_FEASIBILITY = 'Feasibility';
var PROJECT_SETUP = 'Setup';
var PROJECT_CREATE_AGILO_REPORTS = 'Create Agilo Reports';
var PROJECT_CLIENT_INFRASTRUCTURE = 'Client Infrastructure';
var PROJECT_CLIENT_SCRUMBOARD = 'Client Scrumboard';
var PROJECT_CLIENT_BACKLOG = 'Client Backlog';
var PROJECT_READ_BOOKS = 'Read Books';
var PROJECT_PREPARE_TESTDATA = 'Prepare Test Data';
var SPRINT_1_RELEASE_1 = sprints[0].name;
var SPRINT_1_RELEASE_2 = sprints[1].name;
var SPRINT_2_RELEASE_2 = sprints[2].name;
//var SPRINT_3_RELEASE_2 = sprints[3].name;
//var SPRINT_1_RELEASE_3 = sprints[4].name;

var storiesAndTasks = [
    {
        id: 1930,
        type: TYPE_STORY,
        summary: 'Enable and Disable Optional Slices',
        milestone: RELEASE_3,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_FEASIBILITY,
        owner: 'face',
        keywords: '[testing]',
        Project: PROJECT_CLIENT_BACKLOG
    },
    {
        id: 1100,
        type: TYPE_STORY,
        summary: 'Write unit tests',
        milestone: RELEASE_2,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'amy',
        keywords: '[testing]',
        'Story Points': 3,
        Sprint: SPRINT_1_RELEASE_2,
        Project: PROJECT_PREPARE_TESTDATA
    },
    {
        id: 1000,
        type: TYPE_STORY,
        summary: 'Implement dummy backend',
        milestone: RELEASE_2,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'face',
        keywords: '[testing]',
        'Story Points': 2,
        Sprint: SPRINT_1_RELEASE_2,
        Project: PROJECT_PREPARE_TESTDATA
    },
    {
        id: 1001,
        type: TYPE_STORY,
        summary: 'Set up AngularJS project',
        milestone: RELEASE_2,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'amy',
        keywords: '[before camp]',
        'Story Points': 2,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CLIENT_INFRASTRUCTURE
    },
    {
        id: 1002,
        type: TYPE_STORY,
        summary: 'Convert existing jQuery code to AngularJS',
        milestone: RELEASE_2,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'amy',
        keywords: '[before camp]',
        'Story Points': 2,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CLIENT_INFRASTRUCTURE
    },
    {
        id: 1003,
        type: TYPE_STORY,
        summary: 'Add testwatch target',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'amy',
        keywords: '[infrastructure]',
        'Story Points': 1,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_PREPARE_TESTDATA
    },
    {
        id: 1004,
        type: TYPE_STORY,
        summary: 'Read JavaScript book',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'ba',
        keywords: '[education]',
        'Story Points': 2,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_READ_BOOKS
    },
    {
        id: 1005,
        type: TYPE_STORY,
        summary: 'Update time remaining',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'face',
        keywords: '[important]',
        'Story Points': 3,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_PREPARE_TESTDATA
    },
    {
        id: 1006,
        type: TYPE_STORY,
        summary: 'Drag and drop for Scrum Board',
        milestone: RELEASE_2,
        status: STATUS_REOPENED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[usability, important]',
        'Story Points': 1,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CLIENT_SCRUMBOARD
    },
    {
        id: 1007,
        type: TYPE_STORY,
        summary: 'Get All releases',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'face',
        keywords: '[important]',
        'Story Points': 3,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CREATE_AGILO_REPORTS
    },
    {
        id: 2000,
        type: TYPE_TASK,
        summary: 'Serve static agilo reports',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        owner: 'face',
        keywords: '[testing',
        'Work done': 2.5,
        'Remaining time': 1,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CREATE_AGILO_REPORTS,
        'Story ID': 1000
    },
    {
        id: 2001,
        type: TYPE_TASK,
        summary: 'Mock update time remaining',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        owner: 'face',
        keywords: '[testing]',
        'Work done': 0,
        'Remaining time': 2.5,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_PREPARE_TESTDATA,
        'Story ID': 1000
    },
    {
        id: 2002,
        type: TYPE_TASK,
        summary: 'Read intro',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[education]',
        'Remaining time': 5,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_READ_BOOKS,
        'Story ID': 1004
    },
    {
        id: 2003,
        type: TYPE_TASK,
        summary: 'Read chapter 1',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        owner: 'ba',
        keywords: '[testing]',
        'Work done': 2,
        'Remaining time': 10,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_READ_BOOKS,
        'Story ID': 1004
    },
    {
        id: 2004,
        type: TYPE_TASK,
        summary: 'Read chapter 2',
        milestone: RELEASE_2,
        status: STATUS_ASSIGNED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        owner: 'ba',
        keywords: '[education]',
        'Remaining time': 8,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_READ_BOOKS,
        'Story ID': 1004
    },
    {
        id: 2005,
        type: TYPE_TASK,
        summary: 'Create new AngularJS project using Yeoman',
        milestone: RELEASE_2,
        status: STATUS_CLOSED,
        owner: 'amy',
        keywords: '[testing]',
        'Work done': 2,
        Sprint: SPRINT_2_RELEASE_2,
        Project: PROJECT_CLIENT_INFRASTRUCTURE,
        'Story ID': 1001
    },
    {
        id: 3002,
        type: TYPE_STORY,
        summary: 'Edit Story status by shifting Story',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_READY_FOR_ROUGH_ESTIMATION,
        keywords: '[story mapping]',
        'Story Points': 5,
        Project: PROJECT_CLIENT_SCRUMBOARD
    },
    {
        id: 3003,
        type: TYPE_STORY,
        summary: 'Edit Story detail status by shifting Story',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_READY_FOR_DETAIL_ESTIMATION,
        keywords: '[story mapping]',
        'Story Points': 3,
        Project: PROJECT_CLIENT_BACKLOG
    },
    {
        id: 3000,
        type: TYPE_STORY,
        summary: 'Add post-it to story',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_READY_TO_IMPLEMENT,
        keywords: '[story mapping]',
        'Story Points': 4,
        Project: PROJECT_CLIENT_BACKLOG
    },
    {
        id: 3001,
        type: TYPE_STORY,
        summary: 'Drag and drop post-it',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[story mapping]',
        'Story Points': 2,
        Project: PROJECT_CLIENT_BACKLOG
    },
    {
        id: 2050,
        type: TYPE_TASK,
        summary: 'Implement drag and drop',
        milestone: RELEASE_2,
        status: STATUS_NEW,
        'Remaining time': 12,
        Project: PROJECT_CLIENT_BACKLOG,
        'Story ID': 3001
    },
    {
        id: 1101,
        type: TYPE_STORY,
        summary: 'Find Team Members',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[story mapping]',
        Sprint: SPRINT_1_RELEASE_1,
        'Story Points': 3,
        Project: PROJECT_SETUP
    },
    {
        id: 1102,
        type: TYPE_STORY,
        summary: 'Find Budget',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[story mapping]',
        Sprint: SPRINT_1_RELEASE_1,
        'Story Points': 2,
        Project: PROJECT_SETUP
    },
    {
        id: 1105,
        type: TYPE_TASK,
        summary: 'Ask Roger',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        Sprint: SPRINT_1_RELEASE_1,
        'Work done': 3,
        Project: PROJECT_SETUP,
        'Story ID': 1102
    },
    {
        id: 1106,
        type: TYPE_TASK,
        summary: 'Ask Wolfgang',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        Sprint: SPRINT_1_RELEASE_1,
        'Work done': 2,
        Project: PROJECT_SETUP,
        'Story ID': 1102
    },
    {
        id: 1104,
        type: TYPE_STORY,
        summary: 'Prepare For Camp',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[story mapping]',
        Sprint: SPRINT_1_RELEASE_1,
        'Story Points': 1,
        Project: PROJECT_SETUP
    },
    {
        id: 1103,
        type: TYPE_STORY,
        summary: 'Find Project Goal',
        milestone: RELEASE_1,
        status: STATUS_CLOSED,
        'Detail Status': DETAIL_STATUS_NEXT_SPRINT,
        keywords: '[story mapping]',
        Sprint: SPRINT_1_RELEASE_1,
        'Story Points': 2,
        Project: PROJECT_SETUP
    }
];

for (var i = 0; i < storiesAndTasks.length; i++) {
    var ticket = storiesAndTasks[i];
    ticket.ts = '2014-05-01 10:00:00.000000+00:00';
    ticket.time_of_last_change = 1398938400;
}

function getRow(sprint, fields) {
    return fields.map(function (field) {
        return sprint[field];
    }).join('\t');
}

function asTsv(data, fields) {
    return fields.join('\t') + '\n' + data.map(function (row) {
        return getRow(row, fields);
    }).join('\n');
}

function getStoriesAndTasksForSprint(sprint) {
    return storiesAndTasks.filter(function (storyOrTask) {
        return storyOrTask.Sprint === sprint;
    });
}

function getStoriesForRelease(release) {
    return storiesAndTasks.filter(function (storyOrTask) {
        return storyOrTask.milestone === release && storyOrTask.type === TYPE_STORY;
    });
}

function getSprintsInRelease2() {
    return sprints.filter(function (sprint) {
        return sprint.milestone === releases[1].name;
    });
}

function getTicketByNumber(ticketNumber) {
    var foundTicket = storiesAndTasks.filter(function (ticket) {
        return ticket.id === ticketNumber;
    });

    if (foundTicket.length === 1) {
        return foundTicket[0];
    }
}

function getPropertyToChange(requestBody) {
    for (var property in requestBody) {
        if (property !== 'id' && property !== 'ts' && property !== 'time_of_last_change') {
            return property;
        }
    }
}

module.exports.getStoriesAndTasksAsInReport103 = function (sprint) {
    return asTsv(getStoriesAndTasksForSprint(sprint), STORY_AND_TASK_FIELDS);
};

module.exports.getSprintsAsInReport104 = function () {
    return asTsv(getSprintsInRelease2(), SPRINT_FIELDS);
};

module.exports.getReleasesAsInReport108 = function () {
    return asTsv(releases, RELEASE_FIELDS);
};

module.exports.getStoriesAsInReport109 = function (release) {
    return asTsv(getStoriesForRelease(release), STORY_FIELDS_FOR_BACKLOG);
};


module.exports.getTicket = function (ticketNumber) {
    debug('getTicket: ticketNumber = ' + ticketNumber);

    ticketNumber = parseInt(ticketNumber, 10);
    var ticket = getTicketByNumber(ticketNumber);
    if (typeof ticket === 'undefined') {
        debug('ticket ' + ticketNumber + ' not found');
        return;
    }

    return ticket;
};

module.exports.updateTicket = function (ticketNumber, requestBody) {
    debug('updateTicket: ticketNumber = ' + ticketNumber);
    debug('updateTicket: requestBody = ');
    debug(requestBody);

    if (parseInt(ticketNumber, 10) !== parseInt(requestBody.id)) {
        debug(parseInt(ticketNumber, 10) + ' != ' + parseInt(requestBody.id, 10));
        return;
    }

    ticketNumber = parseInt(ticketNumber, 10);
    var ticket = getTicketByNumber(ticketNumber);
    if (typeof ticket === 'undefined') {
        debug('ticket ' + ticketNumber + ' not found');
        return;
    }

    var propertyToChange = getPropertyToChange(requestBody);
    if (typeof propertyToChange === 'undefined') {
        debug('no property found to be changed');
        return;
    }

    if (ticket.ts.toString() !== requestBody.ts.toString()) {
        debug('ts ' + ticket.ts + ' does not match ' + requestBody.ts);
        return {
            errors: [
                'TracError: ts ' + requestBody.ts + ' does not match'
            ],
            current_data: ticket
        };
    }

    if (ticket.time_of_last_change !== parseInt(requestBody.time_of_last_change, 10)) {
        debug('time_of_last_change does not match');
        return {
            errors: [
                'TracError: time_of_last_change ' + requestBody.time_of_last_change + ' does not match'
            ],
            current_data: ticket
        };
    }

    if (ticket.ts !== parseInt(requestBody.ts)) {
        debug('ts does not match');
        return;
    }

    debug('setting property ' + propertyToChange + ' of ticket ' + ticketNumber + ' to ' + requestBody[propertyToChange] + ' (old value: ' + ticket[propertyToChange] + ')');
    ticket[propertyToChange] = requestBody[propertyToChange];
    ticket.ts = '2014-07-03 09:28:16.701189+00:00';
    ticket.time_of_last_change = Math.floor(new Date().getTime() / 1000);

    return ticket;
};