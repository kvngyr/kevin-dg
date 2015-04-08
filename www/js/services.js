'use strict';

angular.module('starter.services', ['ngResource'])

.factory('DataStore', function($http){
    return {
        get: function(){
            console.log('DataStore : get()');
            return $http({
                    // url: 'http://localhost:5984/course/qtGardens',
                    url: 'https://discgolfisfun.iriscouch.com/course/qtGardens',
                    method: 'GET'
                });
        }
    };
});
