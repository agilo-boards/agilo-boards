'use strict';

angular.module('scrumboards.models')
.factory('Task', function(LinkProvider) {
    
    function Task(data) {
        this.id = data.id;
        this.title = data.title;
        this.status = data.status;
        this.owner = data.owner;
        this.timeDone = data.timeDone;
        this.timeRemaining = data.timeRemaining;
        this.sprint = data.sprint;
    }
    
    Task.new = function(data) {
        return new Task(data);
    };

    Task.prototype.totalTime = function () {
        return this.timeDone+this.timeRemaining;
    };
    
    Task.prototype.isClosed = function () {
        return this.timeRemaining === 0;
    };

    Task.prototype.isOnGoing = function () {
        return this.timeRemaining === null;
    };
    
    Task.prototype.getViewTicketUrl = function () {
        return LinkProvider.viewTicket(this.id);
    };

    Task.prototype.getEditTicketUrl = function () {
        return LinkProvider.editTicket(this.id);
    };
    return Task;
});