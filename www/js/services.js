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
                    round.length = 0;
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
            return course.holes;
        },
        getHole: function(holeId) {
            return _.find(course.holes, function(hole){ return hole.id === parseInt(holeId); });
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
            console.log(round);
            deferred.resolve();
            return deferred.promise;
        },
        getScore: function(holeId) {
            // console.info('GameService.getScore()');
            var retVal;

            _.each(round, function(recordedHole) {
                if (recordedHole.id === holeId) {
                    console.log('getScore found score of ' + recordedHole.score);
                    retVal = recordedHole.score;
                }
            });
            return retVal;
        },
        getRound: function() {
            return round;
        }
    };

});
