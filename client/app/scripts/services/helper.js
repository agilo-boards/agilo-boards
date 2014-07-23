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
    function replaceQuote(value) {
        return value.replace(/"([^"])/g, '$1').replace(/"$/g, '');
    }
    
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
                    item[key] = replaceQuote(columns[value].trim());
                });
                return item;
            }
            function mapTransformations(object) {
                angular.forEach(transformationMap, function (value, key) {
                    var arg = object[key];
                    if (!object.hasOwnProperty(key)) {
                        arg = object;
                    }
                    object[key] = value(arg);
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
.service('KeywordParser', function(AGILO_KEYWORDS) {
    var formats = [
        /* Brackets */
        {
            regex: /(\[)([^\]]+)(\])/g,
            group: 2
        },
        /* Normal */
        {
            regex: /(^|\s)([^\]\s;,]+)/g,
            group: 2
        }
    ];
    
    function retrieveGroup(format) {
        return function(value) {
            // This seems to be needed to reset the state of the RegExp
            format.regex.exec('');
            var groups = format.regex.exec(value);
            return groups[format.group];
        };
    }
    
    return {
        parse: function(keywordsStr) {
            var keywords = [];
            for (var name in formats) {
                var format = formats[name];
                var values = keywordsStr.match(format.regex);
                keywordsStr = keywordsStr.replace(format.regex, ' ');
                if (values) {
                    keywords = keywords.concat(values.map(retrieveGroup(format)));
                }
            }
            
            function isValid(keyword) {
                return keyword && keyword.length > 0;
            }
            function trim(keyword) {
                return keyword.trim();
            }
            function colorIt(keyword) {
                var result = {
                    value: keyword
                };
                var matchingTypes = AGILO_KEYWORDS.filter(function(type) {
                    return keyword.match(type.regex);
                });
                if (matchingTypes.length > 0) {
                    result.color = matchingTypes[0].color;
                    result.type = matchingTypes[0].type;
                }
                return result;
            }
            
            return keywords.map(trim).filter(isValid).map(colorIt);
        }
    };
});