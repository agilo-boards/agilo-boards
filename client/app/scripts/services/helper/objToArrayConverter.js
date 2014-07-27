'use strict';

angular.module('scrumboards.helpers')
.service('ObjToArrayConverter', function() {
    return {
        convert: function(obj) {
            var arr = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    arr.push(obj[i]);
                }
            }
            return arr;
        }
    };
});