'use strict';

angular.module('scrumboards')
    .service('UpdateTicketService', function (UpdateTicketResource) {

        function saveTicket(currentTicket, changedProperties, callback, callbackForError) {
            var changedTicket = changedProperties;
            changedTicket['id'] = currentTicket.id;
            changedTicket['ts'] = currentTicket.ts;
            changedTicket['time_of_last_change'] = currentTicket.time_of_last_change;
            
            UpdateTicketResource.save({ticketNumber: currentTicket.id}, changedTicket, callback, callbackForError);
        }

        function closeTicket(ticket, callback, callbackForError) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                saveTicket(ticket, {
                    status: 'closed',
                    resolution: 'fixed'
                }, callback, callbackForError);
            }, callbackForError);
        }

        function changeTime(ticket, difference, callback, callbackForError) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                var properties = {};
                properties['work_done'] = parseFloat(ticket['work_done'])+difference;
                if (ticket['remaining_time']) {
                    properties['remaining_time'] = Math.max(0, parseFloat(ticket['remaining_time'])-difference);
                }
                saveTicket(ticket, properties, callback, callbackForError);
            }, callbackForError);
        }

        function switchSprint(ticket, sprint, callback, callbackForError) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                var properties = {
                    sprint: sprint
                };
                saveTicket(ticket, properties, callback, callbackForError);
            },callbackForError);
        }

        function switchSprintAndSeqNumber(ticket, sprint, seqNumber, callback, callbackForError) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                var properties = {
                    sprint: sprint,
                    story_project_prio: seqNumber
                };
                saveTicket(ticket, properties, callback, callbackForError);
            }, callbackForError);
        }

        function switchSeqNumber(ticket, seqNumber, callback, callbackForError) {
            UpdateTicketResource.get({ticketNumber: ticket.id}).$promise.then(function(tickets) {
                var ticket = tickets[0];
                var properties = {
                    story_project_prio: seqNumber
                };
                saveTicket(ticket, properties, callback, callbackForError);
            }, callbackForError);
        }

        // service interface
        return {
            closeTicket: closeTicket,
            changeTime: changeTime,
            switchSprint: switchSprint,
            switchSeqNumber: switchSeqNumber,
            switchSprintAndSeqNumber: switchSprintAndSeqNumber
        };
    });
