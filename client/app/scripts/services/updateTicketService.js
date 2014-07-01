'use strict';

angular.module('agiloBoardsApp')
    .service('UpdateTicketService', function (UpdateTicketResource) {

        function closeTicket(ticket) {
            UpdateTicketResource.save({ticketNumber: ticket.id}, {
                id: ticket.id,
                // TODO: add actual values
                ts: '2014-07-01 13:27:23.115520+00:00',
                time_of_last_change: 1404221243,
                owner: 'tzhhead2'
            });
        }

        // service interface
        return {
            closeTicket: closeTicket
        };
    });
