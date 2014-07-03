'use strict';

angular.module('agiloBoardsApp')
    .service('UpdateTicketService', function (UpdateTicketResource) {

        function sendCloseTicket(currentTicket) {
            console.log('currentTicket');
            console.log(currentTicket);
            UpdateTicketResource.save({ticketNumber: currentTicket.id}, {
                id: currentTicket.id,
                ts: currentTicket.ts,
                time_of_last_change: currentTicket.time_of_last_change,
                status: 'closed',
                resolution: 'fixed'
            });
        }

        function closeTicket(ticket) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).then(sendCloseTicket(result));
        }

        // service interface
        return {
            closeTicket: closeTicket
        };
    });
