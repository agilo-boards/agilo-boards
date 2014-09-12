'use strict';

var util = require('util');
var pageObjects = require('./generalPageObjects.js');

function Slice(sliceName) {
    var elem = element(by.xpath('//*[@slice-name="'+sliceName+'"]'));
    this.sliceName = sliceName;
    this.removeButton = elem.element(by.className('slice-remove'));
    this.collapseButton = elem.element(by.className('slice-collapse'));
    this.expandButton = elem.element(by.className('slice-expand'));
    pageObjects.PageObject.call(this, elem);
}
util.inherits(Slice, pageObjects.PageObject);

Slice.prototype.assertCollapsed = function () {
    expect(this.elem.getAttribute('class')).toContain('slice-collapsed');
    expect(this.elem.all(by.className('col-project')).get(0).isDisplayed()).toBeFalsy();
};
Slice.prototype.assertNotCollapsed = function () {
    expect(this.elem.getAttribute('class')).toContain('slice-collapsed');
    expect(this.elem.all(by.className('col-project')).get(0).isDisplayed()).toBeTruthy();
};

Slice.prototype.assertStoryPointTotal = function (totalSP) {
    expect(this.elem.element(by.className('slice-name')).getText()).toEqual((this.sliceName || 'Remaining')+' ('+totalSP+' SP)');
};
Slice.prototype.assertStories = function (storiesByProject) {    
    function assertProject(projectElem) {        
        projectElem.getAttribute('ticket-group').then(function(project) {
            if (storiesByProject[project]) {
                expect(projects.get(i).element(by.className('no-stories')).isDisplayed()).toBeFalsy();
                assertStoriesForProject(projects.get(i), storiesByProject[project]);
            } else {
                expect(projects.get(i).element(by.className('no-stories')).isDisplayed()).toBeTruthy();
                expect(projects.get(i).all(by.tagName('story')).count()).toEqual(0);
            }
        });
    }
    function assertStoriesForProject(elem, stories) {
        var storyElems = elem.all(by.tagName('story'));
        expect(storyElems.count()).toEqual(stories.length);
        stories.forEach(function(storyId, index) {
            expect(storyElems.get(index).getAttribute('story-id')).toEqual(storyId.toString());
        });
    }
    var projects = this.elem.all(by.className('col-project'));
    for (var i=0; i<projects.count(); i++) {
        assertProject(projects.get(i));
    }
};

module.exports = Slice;