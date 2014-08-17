'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js');

function BacklogPage(overridePath) {
    BaseWebPage.call(this, overridePath);
}
util.inherits(BacklogPage, BaseWebPage);

BacklogPage.prototype.getSlice = function (sprint) {
    return new pageObjects.Slice(sprint);
};

BacklogPage.prototype.assertStoryNotVisible = function (storyId) {
    expect(element.all(by.id('story-'+storyId)).count()).toEqual(0);
};

BacklogPage.prototype.assertSliceNotVisible = function (sliceName) {
    expect(this.getSlice(sliceName).elem.isDisplayed()).toBeFalsy();    
};

BacklogPage.prototype.findStory = function (storyId) {
    var story = new pageObjects.Story(storyId);
    story.assertStoryNumber();
    return story;
};

module.exports = BacklogPage;