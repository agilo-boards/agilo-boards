'use strict';

angular.module('scrumboards')
    .factory('UpdateTicketResource', function ($resource, $q, $http, AGILO_URL) {
        return $resource(AGILO_URL+'/json/tickets/:ticketNumber', {}, {
            'get':    {method:'GET', isArray:true},
            'save':   {method:'POST'}
        });
    });