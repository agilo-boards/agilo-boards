'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js');

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

ScrumBoardPage.prototype.assertStoryNotVisible = function (storyId) {
    expect(element.all(by.id('story-'+storyId)).count()).toEqual(0);
};

ScrumBoardPage.prototype.findStory = function (storyId) {
    var story = new pageObjects.Story(storyId);
    story.assertStoryNumber();
    return story;
};

module.exports = ScrumBoardPage;