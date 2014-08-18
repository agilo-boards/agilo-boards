'use strict';

var util = require('util'),
    pageObjects = require('../util/pageObjects.js');


function SprintFilter(elem) {
    pageObjects.PageObject.call(this, elem);
    this.resetButton = this.elem.element(by.id('resetButton'));
    this.showAllButton = this.elem.element(by.id('showAllButton'));
    this.closeButton = this.elem.element(by.id('closeButton'));
}
util.inherits(SprintFilter, pageObjects.PageObject);

SprintFilter.prototype.assertSprints = function (sprints) {
    this.waitToBeDisplayed();
    var sprintElems = this.elem.all(by.className('sprint'));
    expect(sprintElems.count()).toEqual(sprints.length);
    sprints.forEach(function(value, index) {
        expect(sprintElems.get(index).getText()).toContain(value);
    });
};
SprintFilter.prototype.getSprint = function (sprint) {
    this.waitToBeDisplayed();
    return new pageObjects.Checkbox(this.elem.element(by.xpath('.//*[@sprint="'+sprint+'"]//input')));
};
SprintFilter.prototype.reset = function () {
    this.waitToBeDisplayed();
    this.resetButton.click();
};
SprintFilter.prototype.showAll = function () {
    this.waitToBeDisplayed();
    this.showAllButton.click();
};
SprintFilter.prototype.close = function () {
    this.waitToBeDisplayed();
    this.closeButton.click();
};
module.exports = SprintFilter;