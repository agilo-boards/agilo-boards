'use strict';

angular.module('agiloBoardsApp')
    .service('Agilo', function($q, AgiloUnformatted) {
    	
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
    				return {
    					id: columns[0].trim(),
    					type: columns[1].trim(),
    					title: columns[2].trim(),
    					release: columns[3].trim(),
    					state: columns[4].trim(),
    					owner: columns[5].trim(),
    					keywords: columns[6].trim(),
    					storyPoints: columns[7].trim(),
    					timeDone: columns[8].trim(),
    					timeRemaining: columns[9].trim(),
    					sprint: columns[10].trim(),
    					project: columns[11].trim(),
    					parentId: columns[12].trim()
    				}
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