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

				element.bind('dragstart', function () {
                    localStorage.setItem('draggedItemId', id);
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
                    
                    e.preventDefault();
					return false;
				});

				element.bind('dragenter', function (e) {
                    if (!scope.agiloOnDragOver({event: e, id: localStorage.getItem('draggedItemId')})) {
                        return;
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