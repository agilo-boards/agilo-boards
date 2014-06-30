function asTSV(table) {
    return table.map(function(line) {
        return line.join('\t');
    }).join('\n');
}
var SprintsData = {
    default:  asTSV([['','','','Sprint 1 (Release 2014-02)'],['','','','Sprint 2 (Release 2014-02)'],['','','','Sprint 3 (Release 2014-02)']])
}