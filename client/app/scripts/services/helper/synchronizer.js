'use strict';

angular.module('scrumboards.helpers')
.service('Synchronizer', function() {
    this.syncToLocalStorage = function(scope, model, isBoolean, callbackOnChange) {
        var value = localStorage.getItem('scrumboards-'+model);
        if (isBoolean) {
            value = value === 'true';
        }
        scope[model] = value;
        scope.$watch(model, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                localStorage.setItem('scrumboards-'+model, newValue);
                if (callbackOnChange) {
                    callbackOnChange();
                }
            }
        });
    };
});

