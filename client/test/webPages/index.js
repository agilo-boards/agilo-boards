/**
 *  note: this collects all page-object in one module.
 *  If anyone (nodejs-guru) knows a better way, please advice..
 *
 *
 *  see https://code.google.com/p/selenium/wiki/PageObjects  for more info on the pageObjects pattern
 */
var NavigationBarPage = require('./navigationBarPage.js');


module.exports = {
    navigationBarPage: NavigationBarPage
};