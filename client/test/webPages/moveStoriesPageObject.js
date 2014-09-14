'use strict';

var util = require('util'),
    pageObjects = require('../util/pageObjects.js');


function MoveStoriesModal(elem) {
    pageObjects.PageObject.call(this, elem);
    this.sprints = new pageObjects.Select('move-stories-sprints');
    this.moveButton = this.elem.element(by.id('moveButton'));
    this.closeButton = this.elem.element(by.id('closeButton'));
}
util.inherits(MoveStoriesModal, pageObjects.PageObject);
MoveStoriesModal.prototype.assertStories = function (stories) {
    this.waitToBeDisplayed();
    var storyElems = this.elem.all(by.tagName('li'));
    expect(storyElems.count()).toEqual(stories.length);
    stories.forEach(function(value, index) {
        expect(storyElems.get(index).getText()).toContain(value);
    });
};
MoveStoriesModal.prototype.assertNoStoriesToMove = function() {
    this.assertStories([]);
    expect(this.elem.element(by.className('no-stories')).isDisplayed()).toBeTruthy();
};
MoveStoriesModal.prototype.move = function () {
    this.waitToBeDisplayed();
    this.moveButton.click();
};
MoveStoriesModal.prototype.close = function () {
    this.waitToBeDisplayed();
    this.closeButton.click();
};
module.exports = MoveStoriesModal;