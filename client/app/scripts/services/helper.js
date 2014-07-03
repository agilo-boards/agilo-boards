'use strict';

angular.module('agiloBoardsApp')
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
    })
.service('TSVtoJSONConverter', function($q) {
    return {
        deferredConversion: function(promise, columnsToPropertiesMap, transformationMap) {
            var deferredResult = $q.defer();
            var converter = this;
            promise.then(function (result) {
                deferredResult.resolve(converter.convert(result, columnsToPropertiesMap, transformationMap));
            }, function (error) {
                deferredResult.reject(error);
            });
            return deferredResult.promise;
            
        },
        convert: function(tsvData, columnsToPropertiesMap, transformationMap) {
            var tsvString = tsvData.data.trim();
            var rows = tsvString.split('\n');
            if (rows && rows[0]) {
                rows.splice(0, 1);
                rows = rows.filter(function (row) {
                    return row.trim().length > 0;
                });
            }
            function mapColumnsToObject(columns) {
                var item = {};
                angular.forEach(columnsToPropertiesMap, function (value, key) {
                    if (typeof columns[value] === 'undefined') {
                        return;
                    }
                    item[key] = columns[value].trim();
                });
                return item;
            }
            function mapTransformations(object) {
                angular.forEach(transformationMap, function (value, key) {
                    object[key] = value(object[key]);
                });
                return object;
            }
            var mappedObjects = rows.map(function (row) {
                var columns = row.split('\t');
                var object = mapColumnsToObject(columns);
                return mapTransformations(object);
            });
            return { data: mappedObjects };
        }
    };
})
.service('KeywordParser', function() {
    return {
        parse: function(keywordsStr) {
            var keywords = [];
            while (keywordsStr.length > 0) {
                var endIndex = keywordsStr.length-1;
                var startIndex = 0;
                if (keywordsStr.indexOf('[')===0) {
                    startIndex = 1;
                    if (keywordsStr.indexOf(']')>=0) {
                        endIndex = keywordsStr.indexOf(']');
                    }
                } else {
                    if (keywordsStr.indexOf(' ')) {
                        endIndex = keywordsStr+1;
                    }
                }
                keywords.push(keywordsStr.substr(startIndex, endIndex));
                keywordsStr = keywordsStr.substr(endIndex+1);
            }
            function keywordNotEmpty(keyword) {
                return keyword.length > 0;
            }
            function trimKeyword(keyword) {
                return keyword.trim();
            }
            return keywords.map(trimKeyword).filter(keywordNotEmpty);
        }
    };
});