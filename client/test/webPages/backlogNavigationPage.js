'use strict';

var BaseWebPage = require('./baseWebPage.js'), util = require('util'),
    pageObjects = require('../util/pageObjects.js');

function BacklogNavigationPage(overridePath) {
    BaseWebPage.call(this, overridePath);

    this.releases = new pageObjects.Select(element(by.xpath('//select[@id="releases"]')));
    this.reloadButton = element(by.id('reloadButton'));
    this.description = new pageObjects.Field(element(by.id('releaseDescription')));
    this.dueDate = new pageObjects.Field(element(by.id('dueDate')), 'Due Date: ');
    this.completedDate = new pageObjects.Field(element(by.id('completedDate')), 'Completed Date: ');
}

util.inherits(BacklogNavigationPage, BaseWebPage);

BacklogNavigationPage.prototype.reload = function () {
    this.reloadButton.click();
};

module.exports = BacklogNavigationPage;