'use strict';

angular.module('agiloBoardsApp')
    .factory('AgiloUnformatted', function($q, $http, AGILO_URL, AGILO_REPORTS) {
        function getHttpResponse(url, errorMsg, params) {
            var deferredResult = $q.defer();
            $http({
                method: 'GET',
                url: AGILO_URL+'/report'+url,
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
                return getHttpResponse(AGILO_REPORTS.sprints+'?format=tab', 'Unable to load sprints', params);
            },
            getStoriesBySprint: function(params) {
                return getHttpResponse(AGILO_REPORTS.storiesAndTasksBySprint+'?max=500&format=tab', 'Unable to load stories by sprint', params);
            },
            getReleases: function(params) {
                return getHttpResponse(AGILO_REPORTS.releases+'?format=tab', 'Unable to load releases', params);
            },
            getStoriesByRelease: function(params) {
                return getHttpResponse(AGILO_REPORTS.storiesByRelease+'?format=tab', 'Unable to load Stories from release', params);
            }
        };
    });