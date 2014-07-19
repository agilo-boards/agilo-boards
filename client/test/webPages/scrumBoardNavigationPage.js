'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util'),
    pageObjects = require('../util/pageObjects.js');

function ScrumBoardNavigationPage(overridePath) {
    BaseWebPage.call(this, overridePath);

    this.sprints = new pageObjects.Select('sprints');  
    this.reloadButton = element(by.id('reloadButton'));
    this.timeDone = new pageObjects.Field(element(by.binding('allTimeDone')), 'Done (with admin): ', ' h');
    this.timeRemaining = new pageObjects.Field(element(by.binding('allTimeRemaining')), 'Remaining: ', ' h');
    this.compactMode = new pageObjects.Checkbox(element(by.id('compactMode')));
    this.ownerMode = new pageObjects.Checkbox(element(by.id('ownerMode')));
    this.owners = new pageObjects.Select('owners');
}

util.inherits(ScrumBoardNavigationPage, BaseWebPage);

ScrumBoardNavigationPage.prototype.reload = function () {
    this.reloadButton.click();
};

module.exports = ScrumBoardNavigationPage;