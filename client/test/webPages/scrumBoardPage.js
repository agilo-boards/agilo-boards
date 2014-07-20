'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js');

function Story(storyId) {
    var elem = element(by.id('story-'+storyId));
    pageObjects.PageObject.call(this, elem);
    
    this.storyId = storyId;
    this.project = new pageObjects.Field(elem.element(by.xpath('.//header//span[1]')));
    this.release = new pageObjects.Field(elem.element(by.xpath('.//header//span[2]')));
    this.storypoint = new pageObjects.Field(elem.element(by.xpath('.//footer//span[1]')), '', ' SP');
    this.timeDone = new pageObjects.Field(elem.element(by.xpath('.//footer//span[2]')), 'done ', 'h');
    this.title = new pageObjects.Field(elem.element(by.xpath('.//span[contains(@class,"story-title")]')));
    this.number = new pageObjects.Field(elem.element(by.xpath('.//span[contains(@class, "story-number")]')), '#');
    this.tasksElem = this.elem.element(by.className('tasks'));
}
util.inherits(Story, pageObjects.PageObject);

Story.prototype.assertStoryNumber = function () {
    this.number.assertToBe(this.storyId);
};
Story.prototype.assertNoTasks = function () {
    expect(this.tasksElem.all(by.className('task-card')).count()).toBe(0);
    expect(this.tasksElem.getText()).toContain('There are currently no tasks.');
};
Story.prototype.assertFullsize = function () {
    expect(this.elem.all(by.className('task-card')).count()).toBe(0);
    expect(this.elem.getAttribute('class')).toMatch('block-fullsize');
};
Story.prototype.assertFadedout = function() {
    expect(this.elem.getAttribute('class')).toMatch('fade-out');
};
Story.prototype.assertNotFadedout = function() {
    expect(this.elem.getAttribute('class')).toNotMatch('fade-out');
};
Story.prototype.assertCreateTaskLink = function() {
    var createTaskLink = this.tasksElem.element(by.tagName('a'));
    expect(createTaskLink.getAttribute('href')).toContain('agilo/eorders/newticket?src='+this.storyId);
};
Story.prototype.assertCompactMode = function() {
    this.project.assertNotVisible();
    this.release.assertNotVisible();
    this.assertStoryNumber();
    this.title.assertVisible();
    this.timeDone.assertNotVisible();
    this.storypoint.assertNotVisible();
};
Story.prototype.assertNotCompactMode = function() {
    this.project.assertVisible();
    this.release.assertVisible();
    this.assertStoryNumber();
    this.title.assertVisible();
    this.timeDone.assertVisible();
    this.storypoint.assertVisible();
    this.assertCreateTaskLink();
};
Story.prototype.assertPostits = function (postits) {
    var postitElems = this.elem.all(by.className('postit'));
    expect(postitElems.count()).toEqual(postits.length);
    postits.forEach(function(value, index) {
        expect(postitElems.get(index).getText()).toContain(value);
    });
};

function ScrumBoardPage(overridePath) {
    BaseWebPage.call(this, overridePath);
}
util.inherits(ScrumBoardPage, BaseWebPage);

ScrumBoardPage.prototype.assertStories = function (storiesTodo, storiesInProgress, storiesDone) {
    var stories = {
        'todo': storiesTodo,
        'inprogress': storiesInProgress,
        'done': storiesDone
    };
    function assertStoryExists(storyElems, storyId, index) {
        expect(storyElems.get(index).getAttribute('id')).toEqual(storyId.toString());
    }
    for (var type in stories) {
        var storyIds = stories[type];
        var storyElems = element(by.id(type)).all(by.className('story-card'));
        expect(storyElems.count()).toEqual(storyIds.length);
        storyIds.forEach(assertStoryExists.bind(null, storyElems));
    }
};

ScrumBoardPage.prototype.findStory = function (storyId) {
    var story = new Story(storyId);
    story.assertStoryNumber();
    return story;
};

module.exports = ScrumBoardPage;