'use strict';

var util = require('util');

function PageObject(elem) {
    this.elem = elem;
}
PageObject.prototype.assertVisible = function() {
    expect(this.elem.isDisplayed()).toBeTruthy();
};
PageObject.prototype.assertNotVisible = function() {
    expect(this.elem.isDisplayed()).toBeFalsy();
};

function Select(id) {
    var elem = element(by.xpath('//select[@id="'+id+'"]'));
    PageObject.call(this, elem);
    this.id = id;
}
util.inherits(Select, PageObject);
Select.prototype.findOption = function(item) {
    return this.elem.element(by.xpath('//select[@id="'+this.id+'"]//option[text() ="' + item + '"]'));
};
Select.prototype.selectOption = function (item) {
    this.elem.click();
    this.findOption(item).click();
};
Select.prototype.assertSelected = function(item) {
    expect(this.findOption(item).isSelected()).toBeTruthy();
};
Select.prototype.assertOptions = function(options) {
    var len = options.length;
    for (var i = 0; i < len; i++) {
        if (i in options) {
            expect(this.elem.element(by.xpath('//select[@id="'+this.id+'"]//option[' + (1 + i) + ']')).getText()).toEqual(options[i]);
        }
    }
};

function Field(elem, prefix, postfix) {
    PageObject.call(this, elem);
    this.prefix = prefix || '';
    this.postfix = postfix || '';
}
util.inherits(Field, PageObject);
Field.prototype.assertToBe = function (expectedText) {
    var that = this;
    this.elem.getText().then(function (text) {
        expect(text).toEqual(that.prefix + expectedText + that.postfix);
    });
};
Field.prototype.assertToStartWith = function (expectedText) {
    var that = this;
    this.elem.getText().then(function (text) {
        expect(text).toContain(that.prefix + expectedText);
    });
};


function Checkbox(elem) {
    PageObject.call(this, elem);
}
util.inherits(Checkbox, PageObject);
Checkbox.prototype.assertSelected = function() {
    expect(this.elem.isSelected()).toBeTruthy();
};
Checkbox.prototype.assertNotSelected = function() {
    expect(this.elem.isSelected()).toBeFalsy();
};
Checkbox.prototype.toggle = function() {
    this.elem.click();
};

module.exports = {
    Select: Select,
    Field: Field,
    Checkbox: Checkbox
};