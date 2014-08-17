'use strict';

var BaseWebPage = require('./baseWebPage.js'), util = require('util'),
    pageObjects = require('../util/pageObjects.js'),
    SprintFilter = require('./sprintFilterPageObject.js');

function BacklogNavigationPage(overridePath) {
    BaseWebPage.call(this, overridePath);

    this.releases = new pageObjects.Select('releases');
    this.reloadButton = element(by.id('reloadButton'));
    this.description = new pageObjects.Field(element(by.id('releaseDescription')));
    this.dueDate = new pageObjects.Field(element(by.id('dueDate')));
    this.completedDate = new pageObjects.Field(element(by.id('completedDate')));
    this.filterButton = element(by.id('filterButton'));
    this.filterModal = new SprintFilter(element(by.id('modal-filter-sprint')));
}

util.inherits(BacklogNavigationPage, BaseWebPage);

BacklogNavigationPage.prototype.reload = function () {
    this.reloadButton.click();
};

module.exports = BacklogNavigationPage;