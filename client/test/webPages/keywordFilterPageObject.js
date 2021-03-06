'use strict';

var util = require('util'),
    pageObjects = require('../util/pageObjects.js');


function KeywordFilter(elem) {
    pageObjects.PageObject.call(this, elem);
    this.resetButton = this.elem.element(by.id('resetButton'));
    this.closeButton = this.elem.element(by.id('closeButton'));
}
util.inherits(KeywordFilter, pageObjects.PageObject);
KeywordFilter.prototype.assertKeywords = function (keywords) {
    this.waitToBeDisplayed();
    var keywordElems = this.elem.all(by.className('keyword'));
    expect(keywordElems.count()).toEqual(keywords.length);
    keywords.forEach(function(value, index) {
        expect(keywordElems.get(index).getText()).toEqual(value);
    });
};
KeywordFilter.prototype.getKeyword = function (keyword) {
    this.waitToBeDisplayed();
    return new pageObjects.Checkbox(this.elem.element(by.xpath('.//*[@keyword="'+keyword+'"]//input')));
};
KeywordFilter.prototype.reset = function () {
    this.waitToBeDisplayed();
    this.resetButton.click();
};
KeywordFilter.prototype.close = function () {
    this.waitToBeDisplayed();
    this.closeButton.click();
};
module.exports = KeywordFilter;