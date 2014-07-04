'use strict';

angular.module('agiloBoardsApp')
	.directive('agiloDraggable', function ($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				angular.element(element).attr('draggable', 'true');
				var id = attrs.id;
				if (!attrs.id) {
					console.error('No id  for draggable object.');
				}

				element.bind('dragstart', function (e) {
					var event = e;
					if (!event.dataTransfer) { event = e.originalEvent; }
					event.dataTransfer.setData('text', id);
					$rootScope.$emit('agiloDraggingStart');
				});

				element.bind('dragend', function () {
					$rootScope.$emit('agiloDraggingEnd');
				});
			}
		};
	});

angular.module('agiloBoardsApp')
	.directive('agiloDropable', function ($rootScope) {
		return {
			restrict: 'A',
			scope: {
				agiloOnDragOver: '&'
			},
			link: function (scope, element, attrs) {
				var id = attrs.id;
				if (!attrs.id) {
					id = 'draggable_' + Math.floor(Math.random()*100000);
					angular.element(element).attr('id', id);
				}

				element.bind('dragover', function (e) {
					var event = e;
					if (!event.dataTransfer) { event = e.originalEvent; }
					event.dataTransfer.dropEffect = 'move';
                    
                    e.stopPropagation();
                    e.preventDefault();
					return false;
				});
                
                function getSourceElement(e) {
                    var srcElement = e.originalEvent.srcElement;
                    if (!srcElement) {
                        var id = e.originalEvent.dataTransfer.getData('text');
                        if (id) {
                            srcElement = $('#'+id)[0];
                        }
                    }
                    var src = $(srcElement).closest('[agilo-draggable]')[0];
                    if (!src) {
                        src = $(srcElement).find('[agilo-draggable]')[0];
                    }
                    return src;
                }

				element.bind('dragenter', function (e) {
                    var src = getSourceElement(e);
                    if (!src) {
                        return;
                    }
                    if (scope.agiloOnDragOver({event: e, src: src})) {
                        return;
                    }
					$('.drag-area-entered').removeClass('drag-area-entered');
					angular.element(e.target).addClass('drag-area-entered');
				});

				element.bind('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
				});

				element.bind('drop', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    
					var event = e;
					if (!event.dataTransfer) { event = e.originalEvent; }
					var data = event.dataTransfer.getData('text');
					var dest = document.getElementById(id);
					var src = document.getElementById(data);
					$rootScope.$broadcast('agilo-dragged', src, dest);
				});

				$rootScope.$on('agiloDraggingStart', function () {
					var el = document.getElementById(id);
					angular.element(el).addClass('drag-started');
				});

				$rootScope.$on('agiloDraggingEnd', function () {
					var el = document.getElementById(id);
					angular.element(el).removeClass('drag-started');
					$('.drag-area-entered').removeClass('drag-area-entered');
				});
			}
		};
	});