'use strict';

angular.module('scrumboards.helpers')
.service('MessageService', function() {
    function start(type) {
        return '<div class="alert alert-'+type+' alert-dismissible" role="alert">'+
            '<button type="button" class="close" data-dismiss="alert">'+
            '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
    }
    var end = '</div>';
    
    function parseError(error) {
        if (!error) {
            return '';
        }
        return ' [Status ' + (error.status || '') +': '+ ('"'+error.data.error+'"' || '')+']';
    }
    
    return {
        error: function(error, title, description) {
            return start('danger') + '<strong>'+title+'</strong> '+description+parseError(error) + end;
        },
        success: function(error, title, description) {
            return start('success') + '<strong>'+title+'</strong> '+description+parseError(error) + end;
        }
    };
});