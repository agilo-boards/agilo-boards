'use strict';

angular.module('scrumboards')
    .service('UpdateTicketService', function (UpdateTicketResource) {

        function sendCloseTicket(currentTicket, callback) {
            console.log('currentTicket');
            console.log(currentTicket);
            
            UpdateTicketResource.save({ticketNumber: currentTicket.id}, {
                id: currentTicket.id,
                ts: currentTicket.ts,
                time_of_last_change: currentTicket.time_of_last_change,
                status: 'closed',
                resolution: 'fixed'
            }, callback);
        }

        function closeTicket(ticket, callback) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(ticket) {
                sendCloseTicket(ticket, callback);
            });
        }

        // service interface
        return {
            closeTicket: closeTicket
        };
    });
