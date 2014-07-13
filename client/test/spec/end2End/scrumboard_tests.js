'use strict';

var pages = require('../../webPages');

describe('Scrumboard, select different sprints in drop down', function() {
    it('updates remaining time', function(){
        browser.driver.manage().window().maximize();
        
        var navigationBarPage = new pages.navigationBarPage();
        browser.get('http://127.0.0.1:8091/#/scrumboard');
        var listOfSprints = [ 'Sprint 1', 'Sprint 2','Sprint 3' ];
        navigationBarPage.assertNumberOfSprints(listOfSprints);
        navigationBarPage.chooseSprintBranch('Sprint 2');
        navigationBarPage.assertTimeDone(4);
        navigationBarPage.assertTimeRemaining(23);
        navigationBarPage.chooseSprintBranch('Sprint 3');
        navigationBarPage.assertTimeDone(0);
        navigationBarPage.assertTimeRemaining(0);
        navigationBarPage.chooseSprintBranch('Sprint 1');
        navigationBarPage.assertTimeDone(5);
        navigationBarPage.assertTimeRemaining(0);
    });
});
