'use strict';

angular.module('scrumboards')
    .service('UpdateTicketService', function (UpdateTicketResource) {

        function saveTicket(currentTicket, changedProperties, callback) {
            var changedTicket = changedProperties;
            changedTicket['id'] = currentTicket.id;
            changedTicket['ts'] = currentTicket.ts;
            changedTicket['time_of_last_change'] = currentTicket.time_of_last_change;
            
            UpdateTicketResource.save({ticketNumber: currentTicket.id}, changedTicket, callback);
        }

        function closeTicket(ticket, callback) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                saveTicket(ticket, {
                    status: 'closed',
                    resolution: 'fixed'
                }, callback);
            });
        }

        function changeTime(ticket, difference, callback) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                var properties = {};
                properties['Work done'] = ticket['Work done']+difference;
                if (ticket['Remaining time']) {
                    properties['Remaining time'] = Math.max(0, ticket['Remaining time']-difference);
                }
                saveTicket(ticket, properties, callback);
            });
        }

        // service interface
        return {
            closeTicket: closeTicket,
            changeTime: changeTime
        };
    });
