'use strict';

angular.module('scrumboards')
.directive('keywordsFilter', function (ObjToArrayConverter, AGILO_KEYWORDS) {
    return {
        restrict: 'E',
        templateUrl: 'templates/keywordsFilter.html',
        link: function (scope) {
            scope.keywordTypes = {};       
            ObjToArrayConverter.convert(AGILO_KEYWORDS).forEach(function(keywordPattern) {
                scope.keywordTypes[keywordPattern.type] = true;
            });
            
            scope.resetKeywordsFilter = function() {
                for (var type in scope.keywordTypes) {
                    scope.keywordTypes[type] = true;
                }
            };
        }
    };
});