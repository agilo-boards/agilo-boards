'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function($q, AgiloUnformatted, AGILO_REPORT_STORIES_AND_TASKS) {
    	
    	function transformTSVtoJSON(serviceCall, params, mapToObject) {
            var deferredResult = $q.defer();
            serviceCall(params).then(function(result) {
            	var rows = result.data.split('\n');
            	if (rows && rows[0]) {
            		rows.splice(0, 1);
                	rows = rows.filter(function (row) {
                		return row.trim().length>0
                	})
            	}
            	deferredResult.resolve({ 
					data: rows.map(function (row) {
						var columns = row.split('\t');
						return mapToObject(columns);
					})
				});
			}, function (error) { deferredResult.reject(error); });
			return deferredResult.promise;
    	}
    	
    	return {
    		getSprints: function() {
    			return transformTSVtoJSON(AgiloUnformatted.getSprints, {}, function (columns) {
    				return columns[3].trim();
    			});
    		},
    		getStoriesBySprint: function(selectedSprint) {
                var deferredResult = $q.defer();
    			var storiesAndTasks = transformTSVtoJSON(AgiloUnformatted.getStoriesBySprint, { SPRINT: selectedSprint }, function (columns) {
                    var item = {};
                    angular.forEach(AGILO_REPORT_STORIES_AND_TASKS, function(key, value) {
                        item[key] = columns[value].trim();
                    });
    			});
    			storiesAndTasks.then(function(items) {
        			var stories = {};
        			var tasks = {};
        			items.data.forEach(function(item) {
        				if (item.type === 'story') {
        					stories[item.id] = item;
        					stories[item.id].tasks = items.data.filter(function(otherItem) {
        						return otherItem.type === 'task' && otherItem.parentId === item.id;
        					})
        				}
        			});
                	deferredResult.resolve({
        				stories: stories
        			});
    			}, function (error) { deferredResult.reject(error); });
    			return deferredResult.promise;
    		}
    	}
    });