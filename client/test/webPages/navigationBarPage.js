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

    this.description = element(by.id('releaseDescription'));
    this.dueDate = element(by.id('dueDate'));
    this.completedDate = element(by.id('completedDate'));
}

util.inherits(NavigationBarPage, BaseWebPage);

NavigationBarPage.prototype.chooseSprintBranch = function (sprintName) {
    // Open menu first, otherwise we cannot click
    element(by.model('sprints')).element(by.xpath('//option[text() =\'' + sprintName + '\']')).click();
};
NavigationBarPage.prototype.chooseReleaseBranch = function (releaseName) {
    // Open menu first, otherwise we cannot click
    element(by.model('releases')).element(by.xpath('//option[text() =\'' + releaseName + '\']')).click();
};

NavigationBarPage.prototype.assertNumberOfSprints = function (listOfSprints) {
    var len = listOfSprints.length;
    for (var i = 0; i < len; i++) {
        if (i in listOfSprints) {
            expect(element(by.xpath('//select[@id="sprints"]/option[' + (1 + i) + ']')).getText()).toEqual(listOfSprints[i]);
        }
    }
};
NavigationBarPage.prototype.assertNumberOfReleases = function (listOfReleases) {
    var len = listOfReleases.length;
    for (var i = 0; i < len; i++) {
        if (i in listOfReleases) {
            expect(element(by.xpath('//select[@id="release"]/option[' + (1 + i) + ']')).getText()).toEqual(listOfReleases[i]);
        }
    }
};

NavigationBarPage.prototype.reload = function () {
    this.reloadButton.click();
};

NavigationBarPage.prototype.assertTimeDone = function (expectedText) {
    this.timeDone.getText().then(function (text) {
        expect(text).toContain('Done (with admin): ' + expectedText);
    });
};
NavigationBarPage.prototype.assertTimeRemaining = function (expectedText) {
    this.timeRemaining.getText().then(function (text) {
        expect(text).toContain('Remaining: ' + expectedText);
    });
};

NavigationBarPage.prototype.assertDescription = function (expectedText) {
    this.description.getText().then(function (text) {
        expect(text).toContain(expectedText);
    });
};
NavigationBarPage.prototype.assertDueDate = function (expectedText) {
    this.dueDate.getText().then(function (text) {
        expect(text).toContain('Due Date: ' + expectedText);
    });
};
NavigationBarPage.prototype.assertCompletedDate = function (expectedText) {
    this.completedDate.getText().then(function (text) {
        if (expectedText){
            expect(text).toContain('Completed Date: ' + expectedText);
        } else {
            expect(text).toContain('Completed Date:');
        }
    });
};

module.exports = NavigationBarPage;