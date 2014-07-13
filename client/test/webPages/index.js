/**
 *  note: this collects all page-object in one module.
 *  If anyone (nodejs-guru) knows a better way, please advice..
 *
 *
 *  see https://code.google.com/p/selenium/wiki/PageObjects  for more info on the pageObjects pattern
 */
var BacklogNavigationPage = require('./backlogNavigationPage.js');
var ScrumBoardNavigationPage = require('./scrumBoardNavigationPage.js');
var ScrumBoardPage = require('./scrumBoardPage.js');
var SlicePage = require('./slicePage.js');


module.exports = {
    backlogNavigationPage: BacklogNavigationPage,
    scrumBoardNavigationPage: ScrumBoardNavigationPage,
    slicePage: SlicePage,
    scrumBoardPage: ScrumBoardPage
};