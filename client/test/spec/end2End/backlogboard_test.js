'use strict';

var pages = require('../../webPages');

describe('Scrumboard, select different releases in drop down', function() {
    it('displays due date and complete date', function(){
        var navigationBarPage = new pages.navigationBarPage();
        browser.get('http://127.0.0.1:8091/#/backlog');
        var listOfReleases = [ 'Release 3', 'Release 2','Release 1' ];
        navigationBarPage.assertNumberOfReleases(listOfReleases);
        navigationBarPage.chooseSprintBranch('Release 2');
        //navigationBarPage.assertTimeDone(4);
        //navigationBarPage.assertTimeRemaining(23);
        navigationBarPage.chooseSprintBranch('Release 3');
        //navigationBarPage.assertTimeDone(0);
        //navigationBarPage.assertTimeRemaining(0);
        navigationBarPage.chooseSprintBranch('Release 1');
        //navigationBarPage.assertTimeDone(5);
        //navigationBarPage.assertTimeRemaining(0);
    });
});
