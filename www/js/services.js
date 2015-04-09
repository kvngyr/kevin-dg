'use strict';

angular.module('starter.services', ['ngResource'])

.factory('DataStore', function($http){
    return {
        get: function(course){
            console.log('DataStore : get(' + course + ')');
            return $http({
                    // url: 'http://localhost:5984/course/qtGardens',
                    url: 'https://discgolfisfun.iriscouch.com/course/' + course,
                    method: 'GET'
                });
        }
    };
});
