'use strict';

angular.module('scrumboards')
.directive('fixed', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.addClass('fixed');
            angular.element($window).bind('scroll', function() {
                element.css('left', document.body.scrollLeft+'px');
            });
        }
    };
});