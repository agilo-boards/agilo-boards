'use strict';

describe('Controller: ScrumboardCtrl', function () {

  // load the controller's module
  beforeEach(module('agiloBoardsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('ScrumboardCtrl', {
      $scope: scope
    });
  }));

  it('should work', function () {
    
  });
});
