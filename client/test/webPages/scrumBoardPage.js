'use strict';

var BaseWebPage = require('./baseWebPage.js'), 
    util = require('util');

function ScrumBoardPage(overridePath) {
    BaseWebPage.call(this, overridePath);

}

util.inherits(ScrumBoardPage, BaseWebPage);

module.exports = ScrumBoardPage;