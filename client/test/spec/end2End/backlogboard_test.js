'use strict';

var pages = require('../../webPages');

describe('Backlog, select different releases in drop down', function() {
    it('displays desription, due date and completed date', function(){
        browser.driver.manage().window().setSize(1150, 800);
        
        var navBar = new pages.backlogNavigationPage();
        browser.get('http://127.0.0.1:8091/#/backlog');
        var listOfReleases = [ 'Release 3', 'Release 2', 'Release 1' ];
        navBar.releases.assertOptions(listOfReleases);

        navBar.releases.selectOption('Release 2');
        navBar.description.assertToStartWith('Software Delivery: Fr ');
        navBar.dueDate.assertToStartWith('Mon ');
        navBar.completedDate.assertToStartWith('Mon ');

        navBar.releases.selectOption('Release 3');
        navBar.description.assertToStartWith('Software Delivery: Fr ');
        navBar.dueDate.assertToStartWith('Mon ');
        navBar.completedDate.assertToBe('undefined');

        navBar.releases.selectOption('Release 1');
        navBar.description.assertToStartWith('Software Delivery: Fr ');
        navBar.dueDate.assertToStartWith('Mon ');
        navBar.completedDate.assertToStartWith('Mon ');
    });
});
