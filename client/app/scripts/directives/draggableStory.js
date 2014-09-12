'use strict';

angular.module('scrumboards')
.directive('draggable', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            angular.element(element).attr('draggable', 'true');

            element.bind('dragstart', function () {
                localStorage.setItem('draggedStoryId', angular.element(element).attr('story-id'));
                $rootScope.$emit('storyDraggingStart');
            });

            element.bind('dragend', function () {
                $rootScope.$emit('storyDraggingEnd');
            });
        }
    };
})

.directive('dropable', function ($rootScope) {
    return {
        restrict: 'A',
        scope: {
        },
        link: function (scope, element, attrs) {
            var id = attrs.id;
            if (!attrs.id) {
                id = 'dropable_' + Math.floor(Math.random()*100000);
                angular.element(element).attr('id', id);
            }
            var placeholderHtml = $('<div class="drag-placeholder"></div>');
            placeholderHtml.bind('dragover', function(event) {
                event.preventDefault();
                return false;
            });
            function getStory(id) {
                return $('story[story-id="'+id+'"]');
            }

            function resetPlaceholders() {
                $('.drag-placeholder').detach();
                $('.no-stories.drag-hide').removeClass('drag-hide');
            }
            
            function setDragAreaEntered(elem) {
                var enteredSlice = $(elem).closest('.slice');
                $('.drag-area-entered').removeClass('drag-area-entered');
                enteredSlice.addClass('drag-area-entered');
            }
            
            function hasDraggedOverChanged(ticketId, isInUpperHalf) {
                var prevTicketId = localStorage.getItem('draggedOverStoryId');
                var prevHalf = localStorage.getItem('draggedOverInUpperHalf') === 'true';
                var idHasChanged = ticketId!==prevTicketId || !prevTicketId;
                var halfHasChanged = prevHalf!==isInUpperHalf || !prevHalf;
                return idHasChanged || halfHasChanged;
            }
            function isInSameTicketGroup(draggedOverItem) {
                var draggedItem = getStory(localStorage.getItem('draggedStoryId'));
                return $(draggedItem).attr('assigned-ticket-group') === $(draggedOverItem).attr('assigned-ticket-group');
            }
            element.bind('dragover', function (e) {
                var event = e;
                if (!event.dataTransfer) { event = e.originalEvent; }
                event.dataTransfer.dropEffect = 'move';

                var target = e.originalEvent.toElement;
                var draggedOverStory = $(target).closest('story')[0];
                if (draggedOverStory) {
                    var contentOfDraggedOverStory = $(draggedOverStory).find('div').first();
                    var height = draggedOverStory.offsetHeight || contentOfDraggedOverStory.height();
                    var isInUpperHalf = ($(draggedOverStory).offset().top + (height/2)) >= event.pageY;
                    var storyId = draggedOverStory.getAttribute('story-id');
                    if (hasDraggedOverChanged(storyId, isInUpperHalf)) {
                        if (storyId === localStorage.getItem('draggedStoryId')) {
                            storyId = undefined;
                            isInUpperHalf = undefined;
                        }
                        localStorage.setItem('draggedOverStoryId', storyId);
                        localStorage.setItem('draggedOverInUpperHalf', isInUpperHalf);
                        resetPlaceholders();
                        if (isInSameTicketGroup(draggedOverStory)) {
                            if (isInUpperHalf === true) {
                                $(draggedOverStory).after(placeholderHtml);
                            } else if (isInUpperHalf === false) {
                                $(draggedOverStory).before(placeholderHtml);
                            }
                        }
                        setDragAreaEntered(draggedOverStory);
                    }
                }
                e.preventDefault();
                return false;
            });

            element.bind('dragenter', function (e) {
                var draggedItem = getStory(localStorage.getItem('draggedStoryId'));
                var ticketGroup = $(e.target).closest('[dropable]').find('.ticket-group[ticket-group="'+draggedItem.attr('assigned-ticket-group')+'"]');
                var noStories = ticketGroup.find('.no-stories:visible, .no-stories.drag-hide');
                if (noStories.length>0) {
                    resetPlaceholders();
                    ticketGroup.append(placeholderHtml);
                    noStories.addClass('drag-hide');
                }
                
                setDragAreaEntered(e.target);
            });
            
            element.bind('dragleave', function () {
            });

            element.bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var event = e;
                if (!event.dataTransfer) { event = e.originalEvent; }
                var dest = document.getElementById(id);
                var storyId = localStorage.getItem('draggedStoryId');
                var src = getStory(storyId);
                var draggedOver = {
                    storyId: localStorage.getItem('draggedOverStoryId'),
                    upperHalf: localStorage.getItem('draggedOverInUpperHalf')==='true'
                };
                resetPlaceholders();
                $rootScope.$broadcast('story-dragged', src, dest, storyId, draggedOver);
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