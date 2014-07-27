'use strict';

angular.module('scrumboards.helpers')
.service('TimeHelper', function() {
    return {
        sum: function(array, method) {
            var total = 0;
            angular.forEach(array, function (item) {
                var num = parseFloat(method(item));
                if (num && (num >= 0 || num < 0)) {
                    total += num;
                }
            });
            return total;
        },
        sumTimeRemaining: function(array) {
            return this.sum(array, function(item) {
                if (angular.isFunction(item.timeRemaining)) {
                    return item.timeRemaining();
                }
                return item.timeRemaining;
            });
        },
        sumTimeDone: function(array) {
            return this.sum(array, function(item) {
                if (angular.isFunction(item.timeDone)) {
                    return item.timeDone();
                }
                return item.timeDone;
            });
        }
    };
});