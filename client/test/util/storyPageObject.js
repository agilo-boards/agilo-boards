'use strict';

var util = require('util');
var pageObjects = require('./generalPageObjects.js');

function Task(elem) {
    pageObjects.PageObject.call(this, elem);
    this.title = new pageObjects.Field(elem.element(by.className('task-title')));
    this.time = new pageObjects.Field(elem.element(by.className('progress')));
    this.ownerImage = elem.element(by.tagName('img'));
    
    this.addTimeBtn = new pageObjects.Button(elem.element(by.className('add-time')));
}
util.inherits(Task, pageObjects.PageObject);

Task.prototype.assertTitle = function (taskTitle) {
    this.title.assertToBe(taskTitle);
};

Task.prototype.assertTime = function (timeDone, timeRemaining) {
        this.time.assertToStartWith(timeDone + ' / '+ (timeRemaining+timeDone) + ' h');
};
Task.prototype.assertOwnerImage = function (owner) {
    expect(this.ownerImage.getAttribute('src')).toContain('images/team/'+owner+'.jpg');
};
Task.prototype.assertNoOwnerImage = function () {
    expect(this.ownerImage.isDisplayed()).toBeFalsy();
};
Task.prototype.assertFadedout = function() {
    expect(this.elem.getAttribute('class')).toContain('fade-out');
};
Task.prototype.assertNotFadedout = function() {
    expect(this.elem.getAttribute('class')).toNotContain('fade-out');
};

function Story(storyId, prefix) {
    var elem = element(by.id((prefix || 'whole-story-')+storyId));
    pageObjects.PageObject.call(this, elem);
    
    this.storyCard = elem.element(by.className('story-card'));
    this.storyId = storyId;
    var header = this.storyCard.element(by.tagName('header'));
    this.project = new pageObjects.Field(header.element(by.className('project')));
    
    var footer = this.storyCard.element(by.tagName('footer'));
    this.storypoint = new pageObjects.Field(header.element(by.className('story-point')), '', ' SP');
    this.time = new pageObjects.Field(footer.element(by.className('progress')));
    
    this.title = new pageObjects.Field(this.storyCard.element(by.className('story-title')));
    this.ownerImage = this.storyCard.element(by.tagName('img'));
    this.number = new pageObjects.Field(this.storyCard.element(by.className('story-number')), '#');
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
    expect(element(by.xpath('//div[@story-id='+this.storyId+']')).getAttribute('class')).toContain('fade-out');
};
Story.prototype.assertNotFadedout = function() {
    expect(this.storyCard.getAttribute('class')).toNotContain('fade-out');
};
Story.prototype.assertCreateTaskLink = function() {
    var createTaskLink = this.elem.element(by.xpath('.//a[contains(@class, "task-creation-link")]'));
    expect(createTaskLink.getAttribute('href')).toContain('agilo/eorders/newticket?src='+this.storyId);
};
Story.prototype.assertToBeClosed = function () {
    expect(this.elem.element(by.className('story-card')).getAttribute('class')).toContain('closed');
};
Story.prototype.assertToHaveTasks = function () {
    expect(this.elem.element(by.className('has-tasks')).isDisplayed()).toBeTruthy();
};
Story.prototype.assertToBeOutOfScope = function () {
    expect(this.elem.element(by.className('out-of-scope')).isDisplayed()).toBeTruthy();
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