'use strict';

angular.module('scrumboards.helpers')
.service('ExperimentalService', function($location) {
    this.isEnabled = function() {
        return !!$location.search()['experimental'];
    };
});