'use strict';

angular.module('agiloBoardsApp')
  .controller('ScrumboardCtrl', function ($scope, $location, Agilo) {
	  var sprints = Agilo.getSprints();
	  $scope.sprints = {
			  selectedSprint: $location.search()['sprint']
	  };
	  $scope.$watch("sprints.selectedSprint", function(newValue, oldValue) {
		  if (newValue !== oldValue) {
			  $location.search('sprint', newValue);
		  }
	  });
	  sprints.then(function(sprints) {
		  if (!$scope.sprints.selectedSprint && sprints.data[0]) {
			  $scope.sprints.selectedSprint = sprints.data[0];
		  }
		  $scope.sprints.allSprints = sprints.data;
		  loadStories($scope.sprints.selectedSprint);
		  
	  }, function(error) {
		  $('#messageContainer').append('<div class="error">'+error+'</div>');
	  });
	  
	  function loadStories(selectedSprint) {
		  var stories = Agilo.getStoriesBySprint(selectedSprint);
		  stories.then(function(result) {
              // Convert stories to an array
              function toArray(obj) {
                var arr=new Array();
                for( var i in obj ) {
                    if (obj.hasOwnProperty(i)){
                        arr.push(obj[i]);
                    }
                }
                return arr;
              }
			  $scope.stories = toArray(result.stories);
		  }, function(error) {
			  $('#messageContainer').append('<div class="error">'+error+'</div>');
		  });
	  }
	  
	  $scope.getViewTicketUrl = function(id) {
		  return 'https://ci2.samw24.bluewin.ch/agilo/eorders/ticket/' + id;
	  }

	  $scope.getEditTicketUrl = function(id) {
		  return $scope.getViewTicketUrl(id)+'?pane=edit';
	  }
      
      $scope.isStoryNew = function(story) {
          return story.state !== 'closed' && story.state !== 'assigned';
      }
  });
