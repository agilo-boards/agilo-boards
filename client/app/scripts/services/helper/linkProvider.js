'use strict';

angular.module('scrumboards.helpers')
.service('LinkProvider', function(AGILO_URL) {
    this.createNewTaskForStory = function(story) {
        return AGILO_URL + '/newticket?'+
                            'src=' + story.id + '&amp;'+
                            'project=' + encodeURI(story.project) + '&amp;'+
                            'milestone=' + encodeURI(story.release) + '&amp;'+
                            'owner=&amp;'+
                            'sprint=' + encodeURI(story.sprint) + '&amp;'+
                            'type=task';
    };
    this.viewTicket = function(id) {
        return AGILO_URL + '/ticket/' + id;
    };
    this.editTicket = function(id) {
        return AGILO_URL + '/ticket/' + id + '?pane=edit';
    };
    this.dashboardUrl = AGILO_URL + '/dashboard';
});