'use strict';

function Select(elem) {
    this.elem = elem;
}
Select.prototype.selectOption = function (item) {
    this.elem.click();
    this.elem.element(by.xpath('//option[text() ="' + item + '"]')).click();
};
    
Select.prototype.assertOptions = function(options) {
    var len = options.length;
    for (var i = 0; i < len; i++) {
        if (i in options) {
            expect(this.elem.element(by.xpath('//option[' + (1 + i) + ']')).getText()).toEqual(options[i]);
        }
    }
};

function Field(elem, prefix, postfix) {
    this.elem = elem;
    this.prefix = prefix || '';
    this.postfix = postfix || '';
}
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
    this.elem = elem;
}
Checkbox.prototype.assertSelected = function() {
    console.log(this.elem);
    expect(this.elem.getAttribute('checked')).toBeTruthy();
};
Checkbox.prototype.assertNotSelected = function() {
    expect(this.elem.getAttribute('checked')).toBeFalsy();
};
Checkbox.prototype.toggle = function() {
    this.elem.click();
};


module.exports = {
    Select: Select,
    Field: Field,
    Checkbox: Checkbox
};