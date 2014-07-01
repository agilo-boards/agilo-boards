// An example configuration file.
exports.config = {
  // The location of the selenium standalone server .jar file.
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
  // find its own unused port.
  seleniumPort: null,
  chromeDriver: './/node_modules/protractor/selenium/chromedriver',
  seleniumArgs: [],

  allScriptsTimeout: 11000,
    
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/spec/end2End/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }

};