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
            .success(function(data) {
                deferredResult.resolve({ data: data });
            })
            .error(function(data, status) {
                deferredResult.reject(errorMsg + ' (status: '+status+')');
            });
            return deferredResult.promise;
        }
        return {
            getSprints: function(params) {
                return getHttpResponse('/104?format=tab', 'Unable to load sprints', params);
            },
            getStoriesBySprint: function(params) {
                return getHttpResponse('/103?max=500&format=tab', 'Unable to load stories by sprint', params);
            },
            getReleases: function(params) {
                return getHttpResponse('/108?format=tab', 'Unable to load releases', params);
            },
            getStoriesByRelease: function(params) {
                return getHttpResponse('/109?format=tab', 'Unable to load Stories from release', params);
            }
        };
    });