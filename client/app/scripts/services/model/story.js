'use strict';

angular.module('scrumboards.models')
.factory('Story', function(Task, LinkProvider, TimeHelper) {
    
    function Story(data) {
        this.id = data.id;
        this.title = data.title;
        this.release = data.release;
        this.status = data.status;
        this.detailStatus = data.detailStatus;
        this.owner = data.owner;
        this.keywords = data.keywords;
        this.storyPoints = data.storyPoints;
        this.sprint = data.sprint;
        this.project = data.project;
        this.seqNumber = data.seqNumber;
        
        this.isInProgress = this.status === 'accepted' || this.status === 'assigned';
        this.isClosed = this.status === 'closed';
        this.isReadyToImplement = this.detailStatus === 'Ready to Implement';
        this.isPlannedForNextSprint = this.detailStatus === 'Next Sprint';
        this.isToDo = !this.isInProgress && !this.isClosed;
    }
    
    Story.new = function(data) {
        return new Story(data);
    };

    Story.prototype.timeDone = function () {
        return TimeHelper.sumTimeDone(this.tasks);
    };

    Story.prototype.timeRemaining = function () {
        return TimeHelper.sumTimeRemaining(this.tasks);
    };

    Story.prototype.totalTime = function () {
        return this.timeDone()+this.timeRemaining();
    };

    Story.prototype.isOnGoing = function () {
        return this.timeRemaining() === null;
    };

    Story.prototype.getNewTaskUrl = function () {
        return LinkProvider.createNewTaskForStory(this);
    };
    
    Story.prototype.getViewTicketUrl = function () {
        return LinkProvider.viewTicket(this.id);
    };

    Story.prototype.getEditTicketUrl = function () {
        return LinkProvider.editTicket(this.id);
    };
    
    Story.prototype.containsAnyFilteredKeywordTypes = function(keywordTypes) {
        return this.keywords.some(function(keyword) {
            if (keyword.type) {
                return !keywordTypes[keyword.type];
            }
            return false;
        });
    };
    return Story;
});