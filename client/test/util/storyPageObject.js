'use strict';

var util = require('util');
var pageObjects = require('./generalPageObjects.js');

function Task(elem) {
    pageObjects.PageObject.call(this, elem);
    this.title = new pageObjects.Field(elem.element(by.className('task-title')));
    this.timeDone = new pageObjects.Field(elem.element(by.className('task-time-done')), 'Done: ', ' h');
    this.timeRemaining = new pageObjects.Field(elem.element(by.className('task-time-remaining')), 'Remaining: ', ' h');
    this.titleCompact = new pageObjects.Field(elem.element(by.className('task-compact-title')));
    this.timeCompact = new pageObjects.Field(elem.element(by.className('task-compact-time')));
}
util.inherits(Task, pageObjects.PageObject);

Task.prototype.assertTitle = function (taskId, taskTitle, compactMode) {
    if (!compactMode) {
        this.title.assertToBe('#'+taskId+': '+taskTitle);
    } else {
        this.titleCompact.assertToBe(taskTitle);
    }
};

Task.prototype.assertTime = function (timeDone, timeRemaining, compactMode) {
    if (!compactMode) {
        this.timeDone.assertToBe(timeDone);
        this.timeRemaining.assertToBe(timeRemaining);
    } else {
        this.timeCompact.assertToBe(timeDone + ' / '+ (timeRemaining+timeDone) + ' h');
    }
};

Task.prototype.assertNotCompactMode = function () {
    this.title.assertVisible();
    this.timeDone.assertVisible();
    this.timeRemaining.assertVisible();
    this.titleCompact.assertNotVisible();
    this.timeCompact.assertNotVisible();
};

Task.prototype.assertCompactMode = function () {
    this.title.assertNotVisible();
    this.timeDone.assertNotVisible();
    this.timeRemaining.assertNotVisible();
    this.titleCompact.assertVisible();
    this.timeCompact.assertVisible();
};

function Story(storyId) {
    var elem = element(by.id('story-'+storyId));
    pageObjects.PageObject.call(this, elem);
    
    this.storyId = storyId;
    this.project = new pageObjects.Field(elem.element(by.xpath('.//header//span[1]')));
    this.release = new pageObjects.Field(elem.element(by.xpath('.//header//span[2]')));
    this.storypoint = new pageObjects.Field(elem.element(by.xpath('.//footer//span[1]')), '', ' SP');
    this.timeDone = new pageObjects.Field(elem.element(by.xpath('.//footer//span[2]')), 'done ', 'h');
    this.title = new pageObjects.Field(elem.element(by.xpath('.//span[contains(@class,"story-title")]')));
    this.ownerImage = this.elem.element(by.tagName('img'));
    this.number = new pageObjects.Field(elem.element(by.xpath('.//span[contains(@class, "story-number")]')), '#');
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
    expect(this.elem.getAttribute('class')).toMatch('fade-out');
};
Story.prototype.assertNotFadedout = function() {
    expect(this.elem.getAttribute('class')).toNotMatch('fade-out');
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