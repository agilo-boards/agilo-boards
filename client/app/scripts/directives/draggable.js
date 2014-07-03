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
				onDrop: '&'
			},
			link: function (scope, element, attrs) {
				var id = attrs.id;
				if (!attrs.id) {
					id = 'draggable_' + Math.floor(Math.random()*100000);
					angular.element(element).attr('id', id);
				}

				element.bind('dragover', function (e) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					var event = e;
					if (!event.dataTransfer) { event = e.originalEvent; }
					event.dataTransfer.dropEffect = 'move';
					return false;
				});

				element.bind('dragenter', function (e) {
					angular.element(e.target).addClass('drag-area-entered');
				});

				element.bind('dragleave', function (e) {
					angular.element(e.target).removeClass('drag-area-entered');
				});

				element.bind('drop', function (e) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					if (e.stopPropogation) {
						e.stopPropogation();
					}

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
					angular.element(el).removeClass('drag-area-entered');
				});
			}
		};
	});