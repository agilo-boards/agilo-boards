'use strict';

var pages = require('../../webPages');

describe('Scrumboard', function() {
    var navBar = new pages.scrumBoardNavigationPage();
    var board = new pages.scrumBoardPage();
    
    beforeEach(function() {
        browser.driver.manage().window().setSize(1250, 800);
        //browser.post('http://127.0.0.1:3000/agilo/eorders/reset');
        browser.get('http://127.0.0.1:8091/#/scrumboard?experimental');
    });
    
    it('updates remaining time when selecting a different sprint', function(){
        var listOfSprints = [ 'Sprint 1', 'Sprint 2','Sprint 3' ];
        navBar.sprints.assertOptions(listOfSprints);
        navBar.sprints.selectOption('Sprint 2');
        navBar.timeDone.assertToBe(7);
        navBar.timeRemaining.assertToBe(15);
        
        navBar.sprints.selectOption('Sprint 3');
        navBar.timeDone.assertToBe(0);
        navBar.timeRemaining.assertToBe(0);
        navBar.sprints.selectOption('Sprint 1');    
        navBar.timeDone.assertToBe(5);
        navBar.timeRemaining.assertToBe(0);
    });
    it('displays the scrum board correctly', function(){
        navBar.sprints.selectOption('Sprint 2');
        board.assertStories([1005, 1006, 1007], [1003, 1004], [1001, 1002]);
        
        var todoStory = board.findStory(1006);
        todoStory.project.assertToBe('Client Scrumboard');
        todoStory.release.assertToBe('Release 2');
        todoStory.assertStoryNumber();
        todoStory.title.assertToBe('Drag and drop for Scrum Board');
        todoStory.timeDone.assertToBe('0');
        todoStory.storypoint.assertToBe('1');
        todoStory.assertPostits(['usabil', 'import']);
        todoStory.assertCreateTaskLink();
        todoStory.assertNoTasks();
        
        var inprogressStory = board.findStory(1004);
        inprogressStory.assertOwner('ba');
        inprogressStory.assertCreateTaskLink();
        inprogressStory.assertTasks(['#2002: Read intro', '#2003: Read chapter 1', '#2004: Read chapter 2']);
        var taskReadIntro =inprogressStory.getTask(0);
        taskReadIntro.assertTitle(2002, 'Read intro');
        taskReadIntro.assertTime(0, 5);
        
        
        var doneStory = board.findStory(1001);
        doneStory.assertFullsize();
        
        navBar.sprints.selectOption('Sprint 1');    
        board.assertStories([], [], [1000, 1100, 1101, 1102, 1103, 1104]);
    });
    
    it('should persist compact mode when switching sprint and display the stories only in compact', function() {        
        browser.get('http://127.0.0.1:8091/#/scrumboard');
        
        navBar.sprints.selectOption('Sprint 1');
        navBar.compactMode.assertNotSelected();
        navBar.compactMode.toggle();
        navBar.compactMode.assertSelected();
        
        navBar.sprints.selectOption('Sprint 2');
        navBar.compactMode.assertSelected();
        
        var story = board.findStory(1006);
        story.assertCompactMode();
        story.assertPostits(['import']);
        
        board.findStory(1003).assertCompactMode();
        board.findStory(1001).assertCompactMode();
        var taskReadIntro = board.findStory(1004).getTask(0);
        taskReadIntro.assertTitle(2002, 'Read intro', true);
        taskReadIntro.assertTime(0, 5, true);
        taskReadIntro.assertCompactMode();
        
        navBar.compactMode.toggle();
        navBar.compactMode.assertNotSelected();
        board.findStory(1006).assertNotCompactMode();
        story.assertPostits(['usabil', 'import']);
        
        taskReadIntro.assertTitle(2002, 'Read intro');
        taskReadIntro.assertTime(0, 5);
        taskReadIntro.assertNotCompactMode();
    });
    
    it('should persist owner mode and the selected owner when switching sprints and fade out any story related to a different person than the owner', function() {
        navBar.sprints.selectOption('Sprint 1');
        var faceStory = board.findStory(1000);
        var amyStory = board.findStory(1100);        
        
        navBar.ownerMode.assertNotSelected();
        navBar.owners.assertNotVisible();
        faceStory.assertNotFadedout();
        amyStory.assertNotFadedout();
        
        navBar.ownerMode.toggle();
        navBar.ownerMode.assertSelected();
        faceStory.assertFadedout();
        amyStory.assertFadedout();
        
        navBar.owners.assertVisible();
        navBar.owners.assertOptions(['', 'amy', 'face']);
        navBar.owners.selectOption('face');
        faceStory.assertNotFadedout();
        amyStory.assertFadedout();
        
        navBar.sprints.selectOption('Sprint 2');        
        faceStory = board.findStory(1005);     
        amyStory = board.findStory(1002);
        
        navBar.ownerMode.assertSelected();
        navBar.owners.assertVisible();
        navBar.owners.assertOptions(['amy', 'ba', 'face']);
        navBar.owners.assertSelected('face');
        amyStory.assertFadedout();
        faceStory.assertNotFadedout();
    });
    
    xit('should increase the time done and decrease time remaining when klicking on +', function() {
        var inprogressStory = board.findStory(1004);
        
        var taskReadIntro =inprogressStory.getTask(0);
        taskReadIntro.assertTime(0, 5);
        taskReadIntro.addTimeBtn.assertNotVisible();
        var taskReadChapter1 =inprogressStory.getTask(1);
        taskReadChapter1.assertTime(2, 10);
        taskReadChapter1.addTimeBtn.assertVisible();
        taskReadChapter1.addTimeBtn.click();
        taskReadChapter1.assertTime(2.5, 9.5);
        
    });
});
