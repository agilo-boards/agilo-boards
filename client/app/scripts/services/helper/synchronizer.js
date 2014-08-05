'use strict';

angular.module('scrumboards.helpers')
.service('Synchronizer', function($location, $parse) {
    this.syncToLocalStorage = function(scope, variableName, options) {
        options = options || {};
        function noTransformation(value) {
            return value;
        }
        var transformToString = options.transformToString || noTransformation;
        var transformToObject = options.transformToObject || noTransformation;
        var scopeModel = options.scopeModel || variableName;
        
        var value = localStorage.getItem('scrumboards-'+variableName);
        
        if (options.getParam && $location.search()[options.getParam]) {
            value = $location.search()[options.getParam];
        }
        if (options.isBoolean) {
            value = value === 'true';
        }
        $parse(scopeModel).assign(scope, transformToObject(value) || options.default);
        if (options.callback) {
            options.callback();
        }
        scope.$watch(scopeModel, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                localStorage.setItem('scrumboards-'+variableName, transformToString(newValue));
                if (options.getParam) {
                    $location.search(options.getParam, transformToString(newValue));
                }
                if (options.callback) {
                    options.callback();
                }
            }
        });
    };
});

