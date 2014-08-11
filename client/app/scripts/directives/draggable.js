'use strict';

angular.module('scrumboards')
.directive('draggable', function ($rootScope, ExperimentalService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (!ExperimentalService.isEnabled()) {
                return;
            }
            angular.element(element).attr('draggable', 'true');
            var id = attrs.id;
            if (!attrs.id) {
                console.error('No id  for draggable object.');
            }

            element.bind('dragstart', function () {
                localStorage.setItem('draggedItemId', id);
                $rootScope.$emit('storyDraggingStart');
            });

            element.bind('dragend', function () {
                $rootScope.$emit('storyDraggingEnd');
            });
        }
    };
})

.directive('dropable', function ($rootScope, ExperimentalService) {
    return {
        restrict: 'A',
        scope: {
        },
        link: function (scope, element, attrs) {
            if (!ExperimentalService.isEnabled()) {
                return;
            }
            var id = attrs.id;
            if (!attrs.id) {
                id = 'draggable_' + Math.floor(Math.random()*100000);
                angular.element(element).attr('id', id);
            }
            var placeholderHtml = $('<div class="drag-placeholder"></div>');
            placeholderHtml.bind('dragover', function(event) {
                event.preventDefault();
                return false;
            });

            function resetPlaceholders() {
                $('.drag-placeholder').detach();
                $('.no-stories.drag-hide').removeClass('drag-hide');
            }
            
            function hasDraggedOverChanged(ticketId, isInUpperHalf) {
                var prevTicketId = localStorage.getItem('draggedOverTicketId');
                var prevHalf = localStorage.getItem('draggedOverInUpperHalf') === 'true';
                var idHasChanged = ticketId!==prevTicketId || !prevTicketId;
                var halfHasChanged = prevHalf!==isInUpperHalf || !prevHalf;
                return idHasChanged || halfHasChanged;
            }
            function isInSameTicketGroup(draggedOverItem) {
                var draggedItem = $('#'+localStorage.getItem('draggedItemId')).closest('story');
                return $(draggedItem).attr('ticket-group') === $(draggedOverItem).attr('ticket-group');
            }
            element.bind('dragover', function (e) {
                var event = e;
                if (!event.dataTransfer) { event = e.originalEvent; }
                event.dataTransfer.dropEffect = 'move';

                var target = e.originalEvent.toElement;
                var closestItem = $(target).closest('story')[0];
                if (closestItem) {
                    var height = closestItem.offsetHeight || $(closestItem).find('div').first().height();
                    var isInUpperHalf = ($(closestItem).offset().top + (height/2)) >= event.pageY;
                    var ticketId = closestItem.getAttribute('ticket-id');
                    if (hasDraggedOverChanged(ticketId, isInUpperHalf)) {
                        if (ticketId === localStorage.getItem('draggedItemId')) {
                            ticketId = undefined;
                            isInUpperHalf = undefined;
                        }
                        localStorage.setItem('draggedOverTicketId', ticketId);
                        localStorage.setItem('draggedOverInUpperHalf', isInUpperHalf);
                        resetPlaceholders();
                        if (isInSameTicketGroup(closestItem)) {
                            if (isInUpperHalf === true) {
                                $(closestItem).after(placeholderHtml);
                            } else if (isInUpperHalf === false) {
                                $(closestItem).before(placeholderHtml);
                            }
                        }
                    }
                }
                e.preventDefault();
                return false;
            });

            element.bind('dragenter', function (e) {
                var draggedItem = $('#'+localStorage.getItem('draggedItemId')).closest('story');
                var ticketGroup = $(e.target).closest('[dropable]').find('.ticket-group[ticket-group="'+draggedItem.attr('ticket-group')+'"]');
                var noStories = ticketGroup.find('.no-stories:visible, .no-stories.drag-hide');
                if (noStories.length>0) {
                    resetPlaceholders();
                    ticketGroup.append(placeholderHtml);
                    noStories.addClass('drag-hide');
                }
                
                $('.drag-area-entered').removeClass('drag-area-entered');
                angular.element(e.target).addClass('drag-area-entered');
            });
            
            element.bind('dragleave', function () {
            });

            element.bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var event = e;
                if (!event.dataTransfer) { event = e.originalEvent; }
                var data = localStorage.getItem('draggedItemId');
                var dest = document.getElementById(id);
                var src = document.getElementById(data);
                var draggedOver = {
                    ticketId: localStorage.getItem('draggedOverTicketId'),
                    upperHalf: localStorage.getItem('draggedOverInUpperHalf')==='true'
                };
                resetPlaceholders();
                $rootScope.$broadcast('story-dragged', src, dest, draggedOver);
            });

            $rootScope.$on('storyDraggingStart', function () {
                var el = document.getElementById(id);
                angular.element(el).addClass('drag-started');
            });

            $rootScope.$on('storyDraggingEnd', function () {
                var el = document.getElementById(id);
                angular.element(el).removeClass('drag-started');
                $('.drag-area-entered').removeClass('drag-area-entered');
            });
        }
    };
});