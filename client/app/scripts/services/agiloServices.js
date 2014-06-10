'use strict';

angular.module('agiloBoardsApp')
    .factory('AgiloUnformatted', function($q, $http, REST_API_URL) {
    	function getHttpResponse(url, errorMsg, params) {
            var deferredResult = $q.defer();
            $http({
            	method: 'GET', 
            	url: REST_API_URL+url,
            	params: params
            })
            .success(function(data, status, headers, config) {
            	deferredResult.resolve({ data: data }); 
            })
            .error(function(data, status, headers, config) {
            	deferredResult.reject(errorMsg + ' (status: '+status+')');
            });
    		return deferredResult.promise;
    	}
    	return {
    		getSprints: getHttpResponse.bind(null, '/104?format=tab', 'Unable to load sprints'),
    		getStoriesBySprint: getHttpResponse.bind(null, '/103?max=500&format=tab', 'Unable to load stories by sprint') 
    	}
    })
