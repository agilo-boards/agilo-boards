'use strict';

var BaseWebPage = require('./baseWebPage.js'), util = require('util');

function NavigationBarPage(overridePath) {
    if (overridePath && overridePath.length > 0) {
        BaseWebPage.call(this, overridePath);
    } else {
        BaseWebPage.call(this, '/');
    }

    this.sprintsSelect = element(by.xpath('//select[@id="sprints"]'));
    this.reloadButton = element(by.id('reloadButton'));
    this.timeDone = element(by.binding('allTimeDone'));
    this.timeRemaining = element(by.binding('allTimeRemaining'));
}

util.inherits(NavigationBarPage, BaseWebPage);

NavigationBarPage.prototype.chooseSprintBranch = function(sprintName) {
    // Open menu first, otherwise we cannot click
    element(by.model('sprints')).element(by.xpath('//option[text() =\''+sprintName+'\']')).click();
};

NavigationBarPage.prototype.assertNumberOfSprints = function(listOfSprints) {
    var len = listOfSprints.length;
    for (var i=0; i<len; i++) {
        if (i in listOfSprints) {
            expect(element(by.xpath('//select[@id="sprints"]/option['+ (1+i) +']')).getText()).toEqual(listOfSprints[i]);
        }
    }
};

NavigationBarPage.prototype.reload = function() {
    this.reloadButton.click();
};

NavigationBarPage.prototype.assertTimeDone = function(expectedText) {
    this.timeDone.getText().then(function (text) {
        expect(text).toContain('done (with admin): '+ expectedText);
    });
};
NavigationBarPage.prototype.assertTimeRemaining = function(expectedText) {
    this.timeRemaining.getText().then(function (text) {
        expect(text).toContain('remaining: ' + expectedText);
    });
};

module.exports = NavigationBarPage;