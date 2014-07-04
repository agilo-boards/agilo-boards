'use strict';

var BaseWebPage = require('./baseWebPage.js'), util = require('util');

function SlicePage(overridePath) {
    if (overridePath && overridePath.length > 0) {
        SlicePage.call(this, overridePath);
    } else {
        SlicePage.call(this, '/');
    }
}

util.inherits(SlicePage, BaseWebPage);

SlicePage.prototype.assertSlices = function() {
    //expect(element(by.id('slice_next-sprint')).toBe('true'));
    //var sliceReadyToImplement = element(by.id('slice_ready-to-implement'));
    //expect(sliceReadyToImplement).toContain('Ready');
    //this.sliceRemaining = element(by.id('slice_remaining'));
};

module.exports = SlicePage;