'use strict';

describe('Service: ObjToArrayConverter', function () {

    beforeEach(module('agiloBoardsApp'));

    var converter;
    beforeEach(inject(function (_ObjToArrayConverter_) {
        converter = _ObjToArrayConverter_;
    }));

    it('should convert an empty object', function () {
        expect(converter.convert({}).length).toBe(0);
    });

    it('should convert an nonempty object', function () {
        var array = converter.convert({ name: 'test', 'some thing': 1});
        expect(array.length).toBe(2);
        expect(array).toContain('test');
        expect(array).toContain(1);
    });
});

describe('Service: TSVtoJSONConverter', function () {

    beforeEach(module('agiloBoardsApp'));

    var converter;
    beforeEach(inject(function (_TSVtoJSONConverter_) {
        converter = _TSVtoJSONConverter_;
    }));

    it('should convert tsv with only a title line', function () {
        var jsonArray = converter.convert({ data: 'title\tlin' }, {});
        expect(jsonArray.data.length).toBe(0);
    });

    it('should convert tsv with a title line and a row', function () {
        var jsonArray = converter.convert({data: 'title\tline\nvalue1\t   value2'}, {param1: 1, param2: 0});
        expect(jsonArray.data.length).toBe(1);
        expect(jsonArray.data[0].param1).toBe('value2');
        expect(jsonArray.data[0].param2).toBe('value1');
    });

    it('should convert tsv with multiline lines and transformation', function () {
        var jsonArray = converter.convert({data: '\ttitle\tline\nvalue1\t   value2\tvalue3\n  value2.1\t  value2.2\t value2.3\n  value2.1\t  value2.2\t value2.3'}, {param1: 1, param2: 2}, {
            param1: function(value) { return value+'123'; },
            param2: function(value) { return value+'456'; }
        });
        expect(jsonArray.data.length).toBe(3);
        expect(jsonArray.data[0]).toEqual({ param1: 'value2123', param2: 'value3456' });
        expect(jsonArray.data[1]).toEqual({ param1: 'value2.2123', param2: 'value2.3456' });
        expect(jsonArray.data[2]).toEqual({ param1: 'value2.2123', param2: 'value2.3456' });
    });
});

describe('Service: KeywordParser', function () {

    beforeEach(module('agiloBoardsApp'));

    var keywordParser;
    beforeEach(inject(function (_KeywordParser_) {
        keywordParser = _KeywordParser_;
    }));

    it('should convert a list of words into an array', function () {
        expect(keywordParser.parse('this is something')).toEqual(['this', 'is', 'something']);
    });
    
    it('should not split multiple words within brackets', function () {
        expect(keywordParser.parse('[this is something]')).toEqual(['this is something']);
    });
    
    it('should be able to support brackets and spaces mixed', function () {
        expect(keywordParser.parse('[this is] something')).toEqual(['this is', 'something']);
    });
    
    it('should be able to support brackets and spaces mixed another way', function () {
        expect(keywordParser.parse('[this is] [something]')).toEqual(['this is', 'something']);
    });
});