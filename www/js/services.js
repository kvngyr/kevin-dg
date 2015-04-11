'use strict';

angular.module('starter.services', ['ngResource'])

.factory('GameService', function($q, $http) {

    var course = {};
    var round = [];

    return {
        downloadCourse: function(courseName) {
            console.info('GameService.downloadCourse()');
            var deferred = $q.defer();

            $http.get('https://discgolfisfun.iriscouch.com/course/' + courseName)
                .success(function(data) {
                    course = data;
                    console.info('GameService.downloadCourse()      : ' + courseName + ' downloaded');
                    deferred.resolve(data);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        getAllHoles: function() {
            console.info('GameService.getAllHoles()');
            var deferred = $q.defer();
            if (course.holes) {
                deferred.resolve(course.holes);
            } else {
                deferred.reject('No holes found');
            }
            return deferred.promise;
        },
        getHole: function(holeId) {
            console.info('GameService.getHole()             : ' + holeId);
            var deferred = $q.defer(),
                thisHole = _.find(course.holes, function(hole){ return hole.id === parseInt(holeId); });
            if (thisHole) {
                deferred.resolve(thisHole);
            } else {
                deferred.reject('Hole not found');
            }
            return deferred.promise;
        },
        setScore: function(holeId, score, par) {
            // console.info('GameService.setScore()');
            var deferred = $q.defer(),
                thisHole = _.find(round, function(hole){ return hole.id === holeId; });

            if (thisHole) {
                console.info('GameService.setScore()            : updating score to ' + score);
                _.each(round, function(hole) {
                    if (hole.id === holeId) hole.score = score;
                });
            } else {
                console.info('GameService.setScore()            : adding new score of ' + score);
                round.push({'id': holeId, 'score': score, 'par': par});
            }
            deferred.resolve();
            return deferred.promise;
        },
        getScore: function(holeId) {
            console.info('GameService.getScore()');
            var deferred = $q.defer(),
                retVal;

            _.each(round, function(recordedHole) {
                if (recordedHole.id === parseInt(holeId)) {
                    // console.log('getScore found score of ' + recordedHole.score);
                    retVal = recordedHole.score;
                }
            });
            deferred.resolve(retVal);
            return deferred.promise;
        }


        // findAll: function() {
        //     var deferred = $q.defer();
        //     deferred.resolve(employees);
        //     return deferred.promise;
        // },

        // findById: function(employeeId) {
        //     var deferred = $q.defer();
        //     var employee = employees[employeeId - 1];
        //     deferred.resolve(employee);
        //     return deferred.promise;
        // },

        // findByName: function(searchKey) {
        //     var deferred = $q.defer();
        //     var results = employees.filter(function(element) {
        //         var fullName = element.firstName + " " + element.lastName;
        //         return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        //     });
        //     deferred.resolve(results);
        //     return deferred.promise;
        // },

        // findByManager: function (managerId) {
        //     var deferred = $q.defer(),
        //         results = employees.filter(function (element) {
        //             return parseInt(managerId) === element.managerId;
        //         });
        //     deferred.resolve(results);
        //     return deferred.promise;
        // }

    };

});
