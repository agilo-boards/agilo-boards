'use strict';

var pages = require('../../webPages');

describe('Backlog Navigation', function() {
    
    var navBar = new pages.backlogNavigationPage();
    beforeEach(function() {
        browser.driver.manage().window().setSize(1250, 800);
        browser.driver.get('http://127.0.0.1:3000/agilo/eorders/reset');
        browser.get('http://127.0.0.1:8091/#/backlog?experimental');
    });
    
    it('displays desription, due date and completed date', function(){
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

describe('Backlog Functionality', function() {
    var navBar = new pages.backlogNavigationPage();
    var backlog = new pages.backlogPage();
    
    beforeEach(function() {
        browser.driver.manage().window().setSize(1250, 800);
        browser.driver.get('http://127.0.0.1:3000/agilo/eorders/reset');
        browser.get('http://127.0.0.1:8091/#/backlog?experimental');
    });
    
    it('shows stories associated with sprints', function(){
        navBar.releases.selectOption('Release 2');
        
        var sliceRemaining = backlog.getSlice('Remaining');
        sliceRemaining.assertStoryPointTotal(14);
        sliceRemaining.assertStories({
            'Client Backlog':   [3000, 3001, 3003],
            'Client Scrumboard':    [3002]
        });
        
        var sliceSprint3 = backlog.getSlice('Sprint 3');
        sliceSprint3.assertStoryPointTotal(0);
        sliceSprint3.assertStories({});
        
        backlog.assertSliceNotVisible('Sprint 1');
        backlog.assertSliceNotVisible('Sprint 2');
    });
    
    it('filters sprints', function(){
        
        backlog.assertSliceNotVisible('Sprint 1');
        backlog.assertSliceNotVisible('Sprint 2');
        backlog.getSlice('Sprint 3').assertStoryPointTotal(0);
        backlog.getSlice('Remaining').assertStoryPointTotal(14);
        
        navBar.filterButton.click();
        navBar.filterModal.assertSprints(['Sprint 1', 'Sprint 2', 'Sprint 3']);
        navBar.filterModal.getSprint('Sprint 1').assertNotSelected();
        navBar.filterModal.getSprint('Sprint 2').assertNotSelected();
        navBar.filterModal.getSprint('Sprint 3').assertSelected();
        
        navBar.filterModal.showAll();
        
        backlog.getSlice('Sprint 1').assertStoryPointTotal(5);
        backlog.getSlice('Sprint 2').assertStoryPointTotal(11);
        backlog.getSlice('Sprint 3').assertStoryPointTotal(0);
        backlog.getSlice('Remaining').assertStoryPointTotal(14);
        
        navBar.filterButton.click();
        navBar.filterModal.getSprint('Sprint 1').assertSelected();
        navBar.filterModal.getSprint('Sprint 2').assertSelected();
        navBar.filterModal.getSprint('Sprint 3').assertSelected();
        
        navBar.filterModal.reset();
        
        backlog.assertSliceNotVisible('Sprint 1');
        backlog.assertSliceNotVisible('Sprint 2');
        backlog.getSlice('Sprint 3').assertStoryPointTotal(0);
        backlog.getSlice('Remaining').assertStoryPointTotal(14);
        
        navBar.filterButton.click();
        navBar.filterModal.getSprint('Sprint 1').assertNotSelected();
        navBar.filterModal.getSprint('Sprint 2').assertNotSelected();
        navBar.filterModal.getSprint('Sprint 3').assertSelected();
        navBar.filterModal.close();
        
    });
});

