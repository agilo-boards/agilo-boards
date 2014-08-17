var pageObjects = require('./generalPageObjects.js');
var Story = require('./storyPageObject.js');
pageObjects.Story = Story;
var Slice = require('./slicePageObject.js');
pageObjects.Slice = Slice;

module.exports = pageObjects;