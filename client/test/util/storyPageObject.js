'use strict';

var util = require('util');
var pageObjects = require('./generalPageObjects.js');

function Task(elem) {
    pageObjects.PageObject.call(this, elem);
    this.title = new pageObjects.Field(elem.element(by.className('task-title')));
    this.timeDone = new pageObjects.Field(elem.element(by.className('task-time-done')), 'Done: ', ' h');
    this.timeRemaining = new pageObjects.Field(elem.element(by.className('task-time-remaining')), 'Remaining: ', ' h');
    this.title = new pageObjects.Field(elem.element(by.className('task-title')));
    this.timeCompact = new pageObjects.Field(elem.element(by.className('progress')));
    
    this.addTimeBtn = new pageObjects.Button(elem.element(by.className('add-time')));
}
util.inherits(Task, pageObjects.PageObject);

Task.prototype.assertTitle = function (taskId, taskTitle, compactMode) {
    if (!compactMode) {
        this.title.assertToBe('#'+taskId+': '+taskTitle);
    } else {
        this.title.assertToBe(taskTitle);
    }
};

Task.prototype.assertTime = function (timeDone, timeRemaining, compactMode) {
    if (!compactMode) {
        this.timeDone.assertToBe(timeDone);
        this.timeRemaining.assertToBe(timeRemaining);
    } else {
        this.timeCompact.assertToStartWith(timeDone + ' / '+ (timeRemaining+timeDone) + ' h');
    }
};

Task.prototype.assertNotCompactMode = function () {
    this.timeDone.assertVisible();
    this.timeRemaining.assertVisible();
    this.title.assertVisible();
    this.timeCompact.assertNotVisible();
};

Task.prototype.assertCompactMode = function () {
    this.timeDone.assertNotVisible();
    this.timeRemaining.assertNotVisible();
    this.title.assertVisible();
    this.timeCompact.assertVisible();
};

function Story(storyId) {
    var elem = element(by.id('whole-story-'+storyId));
    pageObjects.PageObject.call(this, elem);
    
    var storyCard = elem.element(by.className('story-card'));
    this.storyId = storyId;
    var header = storyCard.element(by.tagName('header'));
    this.project = new pageObjects.Field(header.element(by.className('project')));
    this.release = new pageObjects.Field(header.element(by.className('release')));
    
    var footer = storyCard.element(by.tagName('footer'));
    this.storypoint = new pageObjects.Field(footer.element(by.className('story-point')), '', ' SP');
    this.time = new pageObjects.Field(footer.element(by.className('progress')));
    
    this.title = new pageObjects.Field(storyCard.element(by.className('story-title')));
    this.ownerImage = storyCard.element(by.tagName('img'));
    this.number = new pageObjects.Field(storyCard.element(by.className('story-number')), '#');
}
util.inherits(Story, pageObjects.PageObject);

Story.prototype.assertStoryNumber = function () {
    this.number.assertToBe(this.storyId);
};
Story.prototype.assertFullsize = function () {
    expect(this.elem.all(by.className('task-card')).count()).toBe(0);
    expect(this.elem.getAttribute('class')).toMatch('block-fullsize');
};
Story.prototype.assertFadedout = function() {
    expect(this.elem.getAttribute('class')).toContain('fade-out');
};
Story.prototype.assertNotFadedout = function() {
    expect(this.elem.getAttribute('class')).toNotContain('fade-out');
};
Story.prototype.assertCreateTaskLink = function() {
    var createTaskLink = this.elem.element(by.xpath('.//a[contains(@class, "task-creation-link")]'));
    expect(createTaskLink.getAttribute('href')).toContain('agilo/eorders/newticket?src='+this.storyId);
};
Story.prototype.assertCompactMode = function() {
    this.project.assertNotVisible();
    this.release.assertNotVisible();
    this.assertStoryNumber();
    this.title.assertVisible();
    this.time.assertVisible();
    this.storypoint.assertVisible();
};
Story.prototype.assertNotCompactMode = function() {
    this.project.assertVisible();
    this.release.assertVisible();
    this.assertStoryNumber();
    this.title.assertVisible();
    this.time.assertVisible();
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
Story.prototype.assertOwner = function (owner) {
    expect(this.ownerImage.getAttribute('src')).toContain('images/team/'+owner+'.jpg');
};
Story.prototype.assertNoTasks = function () {
    expect(this.elem.all(by.className('task-card')).count()).toBe(0);
    expect(this.elem.element(by.className('tasks')).getText()).toContain('There are currently no tasks.');
};
Story.prototype.assertTasks = function (tasks) {
    var taskElems = this.elem.all(by.xpath('.//*[contains(@class,"task-card")]//*[contains(@class,"task-title")]'));
    expect(taskElems.count()).toEqual(tasks.length);
    tasks.forEach(function(value, index) {
        expect(taskElems.get(index).getText()).toContain(value);
    });
};
Story.prototype.getTask = function (index) {
    var taskElem = this.elem.all(by.xpath('.//*[contains(@class,"task-card")]')).get(index);
    return new Task(taskElem);
};

module.exports = Story;