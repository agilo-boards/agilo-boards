'use strict';

var pages = require('../../webPages');

describe('Scrumboard', function() {
    var navBar = new pages.scrumBoardNavigationPage();
    var board = new pages.scrumBoardPage();
    
    beforeEach(function() {
        browser.driver.manage().window().setSize(1250, 800);
        browser.driver.get('http://127.0.0.1:3000/agilo/eorders/reset');
        browser.get('http://127.0.0.1:8091/#/scrumboard?experimental');
    });
    afterEach(function() {
        browser.driver.get('http://127.0.0.1:3000/agilo/eorders/reset');
    });
    
    it('updates remaining time when selecting a different sprint', function(){
        var listOfSprints = ['Sprint 5 (Release 1)', 'Sprint 1 (Release 2)', 'Sprint 2 (Release 2)', 'Sprint 3 (Release 2)', 'Sprint 1 (Release 3)'];
        navBar.sprints.assertOptions(listOfSprints);
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        navBar.timeDone.assertToBe(8);
        navBar.timeRemaining.assertToBe(18);
        
        navBar.sprints.selectOption('Sprint 1 (Release 3)');    
        navBar.timeDone.assertToBe(0);
        navBar.timeRemaining.assertToBe(0);
    });
    it('displays the scrum board correctly', function(){
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        board.assertStories([1005, 1006, 1007], [1003, 1004], [1001, 1002]);
        
        var todoStory = board.findStory(1006);
        todoStory.project.assertToBe('Client Scrumboard');
        todoStory.assertStoryNumber();
        todoStory.title.assertToBe('Drag and drop for Scrum Board');
        todoStory.time.assertToBeTrimmed('0 h');
        todoStory.storypoint.assertToBe('1');
        todoStory.assertPostits(['usabil', 'import']);
        todoStory.assertCreateTaskLink();
        todoStory.assertNoTasks();
        
        var inprogressStory = board.findStory(1004);
        inprogressStory.assertOwner('ba');
        inprogressStory.time.assertToBeTrimmed('5 / 20 h');
        inprogressStory.storypoint.assertToBe('2');
        inprogressStory.assertCreateTaskLink();
        inprogressStory.assertTasks(['Read intro', 'Read chapter 1', 'Read chapter 2']);
        var taskReadIntro =inprogressStory.getTask(0);
        taskReadIntro.assertTitle('Read intro');
        taskReadIntro.assertTime(0, 5);
        
        
        var doneStory = board.findStory(1001);
        doneStory.assertFullsize();
        
        navBar.sprints.selectOption('Sprint 1 (Release 2)');    
        board.assertStories([], [], [1000, 1100]);
    });
    
    it('should persist hiding of unknown keywords and hide the keywords accordingly', function() {
        navBar.sprints.selectOption('Sprint 1 (Release 2)');
        navBar.hideUnknownKeywords.assertNotSelected();
        navBar.hideUnknownKeywords.toggle();
        navBar.hideUnknownKeywords.assertSelected();
        
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        navBar.hideUnknownKeywords.assertSelected();
        
        var story = board.findStory(1006);
        story.assertPostits(['import']);
        
        navBar.hideUnknownKeywords.toggle();
        navBar.hideUnknownKeywords.assertNotSelected();
        story.assertPostits(['usabil', 'import']);
    });
    
    it('should persist owner mode and the selected owner when switching sprints and fade out any story related to a different person than the owner', function() {
        navBar.sprints.selectOption('Sprint 1 (Release 2)');
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
        navBar.owners.assertOptions(['amy', 'face']);
        navBar.owners.selectOption('face');
        faceStory.assertNotFadedout();
        amyStory.assertFadedout();
        
        navBar.sprints.selectOption('Sprint 2 (Release 2)');        
        faceStory = board.findStory(1005);     
        amyStory = board.findStory(1003);
        
        navBar.ownerMode.assertSelected();
        navBar.owners.assertVisible();
        navBar.owners.assertOptions(['amy', 'ba', 'face']);
        navBar.owners.assertSelected('face');
        amyStory.assertFadedout();
        amyStory.getTask(0).assertFadedout();
        amyStory.getTask(1).assertNotFadedout();
        faceStory.assertNotFadedout();
        
        navBar.ownerMode.toggle();
    });
    
    it('should increase the time done and decrease time remaining when klicking on +', function() {
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        
        var inprogressStory = board.findStory(1004);
        var taskReadIntro = inprogressStory.getTask(2);
        taskReadIntro.assertTime(3, 0);
        taskReadIntro.addTimeBtn.assertNotVisible();
        
        var taskReadChapter1 = inprogressStory.getTask(1);
        taskReadChapter1.assertTime(2, 10);
        taskReadChapter1.addTimeBtn.assertVisible();
        taskReadChapter1.addTimeBtn.click();
        taskReadChapter1.assertTime(2.5, 9.5);
    });
    
    it('should filter by keywords', function() {
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        
        navBar.filter();
        navBar.filterModal.assertKeywords(['clean up', 'depends on', 'important', 'on hold']);
        var keywordImportant = navBar.filterModal.getKeyword('important');
        keywordImportant.assertSelected();
        keywordImportant.toggle();
        keywordImportant.assertNotSelected();
        navBar.filterModal.close();
        
        board.findStory(1004);
        board.assertStoryNotVisible(1005);
        board.assertStoryNotVisible(1006);
        board.assertStoryNotVisible(1007);
        
        navBar.filter();
        keywordImportant.assertNotSelected();
        navBar.filterModal.reset();
        
        board.findStory(1005);
        board.findStory(1006);
        board.findStory(1007);
    });
    
    it('should show owner picture if story has tasks not assigned to the owner of the story', function() {
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        
        var storyWithOnlyOneOwner = board.findStory(1004);
        storyWithOnlyOneOwner.getTask(1).assertNoOwnerImage();
        storyWithOnlyOneOwner.getTask(2).assertNoOwnerImage();
        
        var storyWithMultipleOwners = board.findStory(1003);
        storyWithMultipleOwners.assertOwner('amy');
        storyWithMultipleOwners.getTask(0).assertOwnerImage('amy');
        storyWithMultipleOwners.getTask(1).assertOwnerImage('face');
    });
    
    it('moves all stories with state todo and in progess to next sprint', function() {
        navBar.sprints.selectOption('Sprint 2 (Release 2)');
        board.assertStories([1005, 1006, 1007], [1003, 1004], [1001, 1002]);
        
        navBar.moveStories();
        navBar.moveStoriesModal.sprints.assertOptions(['Sprint 1 (Release 2)', 'Sprint 3 (Release 2)']);
        navBar.moveStoriesModal.sprints.assertSelected('Sprint 3 (Release 2)');
        navBar.moveStoriesModal.assertStories(['#1003', '#1004', '#1005', '#1006', '#1007']);
        navBar.moveStoriesModal.move();
        navBar.moveStoriesModal.close();
        
        board.assertStories([], [], [1001, 1002]);
        
        navBar.sprints.selectOption('Sprint 3 (Release 2)');        
        board.assertStories([1005, 1006, 1007], [1003, 1004], []);
        
        
        navBar.sprints.selectOption('Sprint 1 (Release 2)');  
        navBar.moveStories();
        navBar.moveStoriesModal.assertNoStoriesToMove();
    });
});
