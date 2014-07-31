'use strict';

angular.module('scrumboards')
.directive('scaleToFit', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var text = attrs['scaleToFit'];
            var maxLength_oneLine = 11;
            if (text.length > maxLength_oneLine) {
                if (text.length > 2*maxLength_oneLine) {
                    text = text.substr(0, (2*maxLength_oneLine)-3)+'..';
                }
                if (text.substr(maxLength_oneLine-6, maxLength_oneLine+2).indexOf(' ') === -1) {
                    var separatorIndex = maxLength_oneLine - 1;
                    if (text.length < maxLength_oneLine+3) {
                        separatorIndex = separatorIndex - 2;
                    }
                    text = text.substr(0, separatorIndex)+'- '+text.substr(separatorIndex);
                }
                element.addClass('postit-twolines');
            } else {
                element.removeClass('postit-twolines');
            }
            element.html(text);
        }
    };
});