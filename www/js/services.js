'use strict';

angular.module('starter.services', ['ngResource'])

.factory('GameService', function($q, $http, SettingService) {

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

            // console.log('course.holes: ', course.holes);
            // console.log('round: ', round);
            // var retVal = [],
            //     match = null;

            // // There are no scores recorded (game just started?) return all the holes
            // if (!round.length) {
            //     course.holes.forEach(function(courseHole){
            //         retVal.push(courseHole);
            //     });
            //     return retVal;
            // } else if (SettingService.get('hideComplete').checked) {
            //     // There are scores recorded and we are hiding completed holes, return unscored holes
            //     course.holes.forEach(function(courseHole){
            //         match = _.findWhere(round, {id: courseHole.id });
            //         if (match) {
            //             console.log('courseHole.id ' + courseHole.id + ' has a recorded score of ' + match.score + ' SKIP!');
            //         } else {
            //             retVal.push(match);
            //             console.log('courseHole.id ' + courseHole.id + ' has NO recorded score RETURN!');
            //         }
            //     });
            //     return retVal;
            // } else {
            //     // Return all the holes
            //     course.holes.forEach(function(courseHole){
            //         retVal.push(courseHole);
            //     });
            //     return retVal;
            // }
        },
        getHole: function(holeId) {
            return _.find(course.holes, function(hole){ return hole.id === parseInt(holeId); });
        },
        setScore: function(holeId, score, par) {
            // console.info('GameService.setScore()');
            var deferred = $q.defer(),
                thisHole = _.find(round, function(hole){ return hole.id === holeId; });

            if (thisHole) {
                // console.info('GameService.setScore()            : updating score to ' + score);
                _.each(round, function(hole) {
                    if (hole.id === holeId) hole.score = score;
                });
            } else {
                // console.info('GameService.setScore()            : adding new score of ' + score);
                round.push({'id': holeId, 'score': score, 'par': par});
            }
            // console.log(round);
            deferred.resolve();
            return deferred.promise;
        },
        getScore: function(holeId) {
            // console.info('GameService.getScore()');
            var retVal;

            _.each(round, function(recordedHole) {
                if (recordedHole.id === holeId) {
                    // console.log('getScore found score of ' + recordedHole.score);
                    retVal = recordedHole.score;
                }
            });
            return retVal;
        },
        getRound: function() {
            return round;
        },
        endRound: function() {
            round.length = 0;
        }
    };

})

.factory('SettingService', function() {
    var settings = {
        hideComplete: {
            checked: true
        }
    };

    return {
        get: function(settingName) {
            console.log('SettingService.get(' + settingName + ')');
            return settings[settingName];
        },
        set: function(settingName, settingValue) {
            console.log('SettingService.set(' + settingName + ', ' + settingValue + ')');
            settings[settingName] = {checked: settingValue};
        }
    };
});
