'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js'),
    KeywordFilter = require('./keywordFilterPageObject.js'),
    MoveStoriesModal = require('./moveStoriesPageObject.js');


function ScrumBoardNavigationPage(overridePath) {
    BaseWebPage.call(this, overridePath);

    this.sprints = new pageObjects.Select('sprints');  
    this.reloadButton = element(by.id('reloadButton'));
    this.filterButton = element(by.id('filterButton'));
    this.filterModal = new KeywordFilter(element(by.id('modal-filter-keywords')));
    
    this.moveStoriesButton = element(by.id('moveStoriesButton'));
    this.moveStoriesModal = new MoveStoriesModal(element(by.id('modal-move-stories')));
    this.timeDone = new pageObjects.Field(element(by.binding('allTimeDone')), 'Done (with admin): ', ' h');
    this.timeRemaining = new pageObjects.Field(element(by.binding('allTimeRemaining')), 'Remaining: ', ' h');
    this.compactMode = new pageObjects.Checkbox(element(by.id('compactMode')));
    this.ownerMode = new pageObjects.Checkbox(element(by.id('ownerMode')));
    this.owners = new pageObjects.Dropdown('owners');
}

util.inherits(ScrumBoardNavigationPage, BaseWebPage);

ScrumBoardNavigationPage.prototype.reload = function () {
    this.reloadButton.click();
};
ScrumBoardNavigationPage.prototype.filter = function () {
    this.filterButton.click();
};
ScrumBoardNavigationPage.prototype.moveStories = function () {
    this.moveStoriesButton.click();
};


module.exports = ScrumBoardNavigationPage;