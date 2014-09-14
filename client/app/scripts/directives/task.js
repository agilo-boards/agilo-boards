'use strict';

angular.module('scrumboards')
.directive('task', function (MessageService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/task.html',
        scope: {
            task: '=',            
            fadedOut: '=',
            showOwnerImage: '@'
        },
        controller: function ($scope, $window, UpdateTicketService) {
            $scope.changeTime = function(task, difference, event) {
                UpdateTicketService.changeTime(task, difference, function() {
                    $scope.$emit('reloadBoard');
                }, function (error) {
                    $('#messageContainer').append(MessageService.error(error, 'Unable to update ticket.', 'Make sure you are logged in to modify the ticket.'));
                });
                event.preventDefault();
                event.stopPropagation();
            };
        }
    };
});