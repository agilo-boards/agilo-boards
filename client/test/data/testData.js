'use strict';

angular.module('agiloBoardsApp')
    .service('TestData', function () {

        return {
            SPRINTS: 'description	sprint_end	milestone	name	start	team' +
                '\nFirst Sprint	1405677600	Release 1.3	Sprint 1	1402005600	A Team' +
                '\nSecond Sprint	1405677600	Release 1.3	Sprint 2	1403820000	A Team' +
                '\nThird Sprint	1403863200	Release 1.3	Sprint 3	1405634400	A Team',

            STORIES_AND_TASKS_SPRINT_2: 'id	type	summary	milestone	status	owner	keywords	Story Points	Work done	Remaining time	Sprint	Project	Story ID'+
                '\n1000	story	Implement dummy backend	Release 1.3	assigned	face	[testing]	2			Sprint 2	agiloBoards  ' +
                '\n1001	story	Set up AngularJS project	Release 1.3	closed	amy	test [before camp] [testing]	2			Sprint 2	agiloBoards    ' +
                '\n1002	story	Convert existing jQuery code to AngularJS	Release 1.3	closed	amy	[before camp]	2			Sprint 2	agiloBoards   ' +
                '\n1003	story	Add testwatch target	Release 1.3	assigned	amy	[infrastructure]	1			Sprint 2	agiloBoards   ' +
                '\n1004	story	Read JavaScript book	Release 1.3	assigned	ba		2			Sprint 2	education  '+
                '\n1005	story	Update time remaining	Release 1.3	new		[important]	3			Sprint 2	agiloBoards   ' +
                '\n1006	story	Drag and drop	Release 1.3	reopened		[usability]	1			Sprint 2	agiloBoards  ' +
                '\n1007	story	Focus on a person during daily	Release 1.3	new		[important]	3			Sprint 2	agiloBoards  ' +
                '\n2000	task	Serve static agilo reports	Release 1.3	assigned	face			2.5		Sprint 2	agiloBoards   1000'+
                '\n2000	task	Mock update time remaining	Release 1.3	new				2.5		Sprint 2	agiloBoards    1000' +
                '\n2001	task	Read intro	Release 1.3	assigned	ba			2		Sprint 2	education	1004' +
                '\n2002	task	Read chapter 1	Release 1.3	assigned	ba			10		Sprint 2	education	1004' +
                '\n2003	task	Read chapter 2	Release 1.3	assigned	ba			8		Sprint 2	education	1004' +
                '\n2004	task	Create new AngularJS project using Yoman	Release 1.3	closed	amy			2	0	Sprint 2	agiloBoards 1001'
        };
    });