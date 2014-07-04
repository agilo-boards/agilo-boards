'use strict';

var pages = require('../../webPages');

describe('Backlog, select different releases in drop down', function() {
    it('displays desription, due date and completed date', function(){
        var navigationBarPage = new pages.navigationBarPage();
        browser.get('http://127.0.0.1:8091/#/backlog');
        var listOfReleases = [ 'Release 3', 'Release 2', 'Release 1' ];
        navigationBarPage.assertNumberOfReleases(listOfReleases);

        navigationBarPage.chooseSprintBranch('Release 2');
        navigationBarPage.assertDescription('Software Delivery: Fr ');
        navigationBarPage.assertDueDate('Mon ');
        navigationBarPage.assertCompletedDate('Mon ');

        navigationBarPage.chooseSprintBranch('Release 3');
        navigationBarPage.assertDescription('Software Delivery: Fr ');
        navigationBarPage.assertDueDate('Mon ');
        navigationBarPage.assertCompletedDate('');

        navigationBarPage.chooseSprintBranch('Release 1');
        navigationBarPage.assertDescription('Software Delivery: Fr ');
        navigationBarPage.assertDueDate('Mon ');
        navigationBarPage.assertCompletedDate('Mon ');
    });
});
