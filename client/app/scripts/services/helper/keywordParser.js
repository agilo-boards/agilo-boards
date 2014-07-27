'use strict';

angular.module('scrumboards.helpers')
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