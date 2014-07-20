'use strict';

var pages = require('../../webPages');

describe('Scrumboard', function() {
    var navBar = new pages.scrumBoardNavigationPage();
    var board = new pages.scrumBoardPage();
    
    beforeEach(function() {
        browser.driver.manage().window().setSize(1150, 800);
        browser.get('http://127.0.0.1:8091/#/scrumboard');
    });
    
    it('updates remaining time when selecting a different sprint', function(){
        browser.get('http://127.0.0.1:8091/#/scrumboard');
        var listOfSprints = [ 'Sprint 1', 'Sprint 2','Sprint 3' ];
        navBar.sprints.assertOptions(listOfSprints);
        navBar.sprints.selectOption('Sprint 2');
        navBar.timeDone.assertToBe(4);
        navBar.timeRemaining.assertToBe(23);
        navBar.sprints.selectOption('Sprint 3');
        navBar.timeDone.assertToBe(0);
        navBar.timeRemaining.assertToBe(0);
        navBar.sprints.selectOption('Sprint 1');
        board.assertStories([], [], [1000, 1100, 1101, 1102, 1103, 1104]);
        navBar.timeDone.assertToBe(5);
        navBar.timeRemaining.assertToBe(0);
    });
    
    it('persists owner mode and compact mode when switching sprints', function() {        
        browser.get('http://127.0.0.1:8091/#/scrumboard');
        
        navBar.sprints.selectOption('Sprint 1');
        navBar.compactMode.assertNotSelected();
        navBar.compactMode.toggle();
        navBar.compactMode.assertSelected();
        
        navBar.ownerMode.assertNotSelected();
        navBar.owners.assertNotVisible();
        navBar.ownerMode.toggle();
        navBar.ownerMode.assertSelected();
        navBar.owners.assertVisible();
        navBar.owners.assertOptions(['', 'amy', 'face']);
        navBar.owners.selectOption('face');
        
        navBar.sprints.selectOption('Sprint 2');
        navBar.compactMode.assertSelected();
        navBar.compactMode.toggle();
        navBar.compactMode.assertNotSelected();
        
        navBar.ownerMode.assertSelected();
        navBar.owners.assertVisible();
        navBar.owners.assertOptions(['amy', 'ba', 'face']);
        navBar.owners.assertSelected('face');
    });
});
