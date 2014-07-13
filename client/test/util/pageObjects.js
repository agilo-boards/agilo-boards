'use strict';

function Select(element) {
    this.element = element;
}
Select.prototype.selectOption = function (item) {
    this.element.click();
    this.element.element(by.xpath('//option[text() ="' + item + '"]')).click();
};
    
Select.prototype.assertOptions = function(options) {
    var len = options.length;
    for (var i = 0; i < len; i++) {
        if (i in options) {
            expect(this.element.element(by.xpath('//option[' + (1 + i) + ']')).getText()).toEqual(options[i]);
        }
    }
};

function Field(element, prefix, postfix) {
    this.element = element;
    this.prefix = prefix || '';
    this.postfix = postfix || '';
}
Field.prototype.assertToBe = function (expectedText) {
    var that = this;
    this.element.getText().then(function (text) {
        expect(text).toEqual(that.prefix + expectedText + that.postfix);
    });
};
Field.prototype.assertToStartWith = function (expectedText) {
    var that = this;
    this.element.getText().then(function (text) {
        expect(text).toContain(that.prefix + expectedText);
    });
};


function Checkbox(element) {
    this.element = element;
}
Checkbox.prototype.assertSelected = function() {
    expect(element.getAttribute('checked')).toBeTruthy();
};
Checkbox.prototype.assertNotSelected = function() {
    console.log(element);
    expect(element.getAttribute('checked')).toBeFalsy();
};
Checkbox.prototype.toggle = function() {
    element.click();
};


module.exports = {
    Select: Select,
    Field: Field,
    Checkbox: Checkbox
};