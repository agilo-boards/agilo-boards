'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js');

function Story(storyId, type) {
    var elem = element(by.xpath('//[@id="'+type+'"]//[@id="story-'+storyId+'"]'));
    pageObjects.PageObject.call(this, elem);
    
}
util.inherits(Story, pageObjects.PageObject);

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

ScrumBoardPage.prototype.findStoryTodo = function (storyId) {
    return new Story(storyId, 'todo');
};

ScrumBoardPage.prototype.findStoryInProgress = function (storyId) {
    return new Story(storyId, 'inprogress');
};

ScrumBoardPage.prototype.findStoryClosed = function (storyId) {
    return new Story(storyId, 'done');
};

module.exports = ScrumBoardPage;