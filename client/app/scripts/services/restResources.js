'use strict';

angular.module('agiloBoardsApp')
    .factory('UpdateTicketResource', function ($resource) {
        return $resource('http://localhost:3000/agilo/eorders/json/tickets/:ticketNumber');
    });