'use strict';

var e2eUtils = require('../util/e2eUtil.js');


function BaseWebPage(path) {
    this.path = path;
}

BaseWebPage.prototype.assertPageIsDisplayed = function () {
    e2eUtils.assertRoute(this.path);
};

module.exports = BaseWebPage;