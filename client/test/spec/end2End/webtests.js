'use strict';


describe('Scrumboard, selecting sprint', function() {
    it('check sprints in drop down', function(){
        browser.get('http://127.0.0.1:8091/#/scrumboard');
        element(by.model('sprints')).element(By.xpath('//option[text() =\'Sprint 1\']')).click();
        element(by.model('sprints')).element(By.xpath('//option[text() =\'Sprint 2\']')).click();
        expect(element(By.xpath('//select[@id="sprints"]/option[1]')).getText()).toEqual('Sprint 1');
        expect(element(By.xpath('//select[@id="sprints"]/option[2]')).getText()).toEqual('Sprint 2');
    });
});
