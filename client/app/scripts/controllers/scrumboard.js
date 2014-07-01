'use strict';

angular.module('agiloBoardsApp')
  .controller('ScrumboardCtrl', function ($scope, $location, Agilo, AGILO_URL) {
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
      
      $scope.reload = function() {
		  loadStories($scope.sprints.selectedSprint);
      }
	  
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
              $scope.stories.map(enrichStory);
              $scope.allTimeDone = sum($scope.stories, function(story) { return story.timeDone; });
              $scope.allTimeRemaining = sum($scope.stories, function(story) { return story.timeRemaining; });
		  }, function(error) {
			  $('#messageContainer').append('<div class="error">'+error+'</div>');
		  });
	  }
      
      function enrichStory(story) {
          story.timeRemaining = sum(story.tasks, function(task) { return task.timeRemaining; });
          story.timeDone = sum(story.tasks, function(task) { return task.timeDone; });
          return story;
      }
	  
	  $scope.getDashboardUrl = function() {
		  return AGILO_URL+'/dashboard';
	  }
	  
	  $scope.getViewTicketUrl = function(id) {
		  return AGILO_URL+'/ticket/' + id;
	  }

	  $scope.getEditTicketUrl = function(id) {
		  return $scope.getViewTicketUrl(id)+'?pane=edit';
	  }
      
      $scope.isStoryNew = function(story) {
          return story.state !== 'closed' && story.state !== 'assigned';
      }
      
      function sum(array, method) {
          var total = 0;
          angular.forEach(array, function(item) {
              var num = parseFloat(method(item));
              if (num && (num >=0 || num < 0)) {
                total += num;
              }
          });
          return total;
      }
  });
