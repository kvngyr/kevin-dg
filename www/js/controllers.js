'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', [function() {

}])

.controller('BrowseCtrl', ['GameService', '$scope', '$state', '$ionicLoading', function(GameService, $scope, $state, $ionicLoading) {

    $scope.startGame = function(course) {
        $ionicLoading.show({template: 'Loading'});
        GameService.downloadCourse(course).then(function() {
            $ionicLoading.hide();
            $state.go('app.holes');
        }, function(error) {
            console.error('BrowseCtrl                    : ' + error);
        });
    };

}])

.controller('HolesCtrl', ['GameService', '$scope', '$state', function(GameService, $scope, $state) {

    GameService.getAllHoles().then(function (holes) {
        $scope.holes = holes;
    }, function(error) {
        console.error('HoleCtrl                      : ' + error);
        console.info ('HoleCtrl                          : redirecting to app.browse');
        $state.go('app.browse');
    });

}])

.controller('HoleCtrl', ['GameService', '$scope', '$stateParams', '$state', function(GameService, $scope, $stateParams, $state) {

    $scope.setScore = function(score) {
        GameService.setScore($scope.holeId, score, $scope.hole.par).then(function(){
            $scope.hole.score = score;
        }, function(error) {
            console.error('HoleCtrl                      : ' + error);
        });
    };

   $scope.back = function() {
        GameService.getHole(parseInt($stateParams.holeId) - 1).then(function(hole) {
            $state.go('app.single', {'holeId': hole.id});
            // return hole;
        }, function(error) {
            // Not really an "error", we've run out of holes... Redirect to app.holes
            console.info ('HolesCtrl                         : ' + error);
            console.info ('HolesCtrl                         : redirecting to app.holes');
            $state.go('app.holes');
        });

    };

    $scope.next = function() {
        GameService.getHole(parseInt($stateParams.holeId) + 1).then(function(hole) {
            $state.go('app.single', {'holeId': hole.id});
            // return hole;
        }, function(error) {
            // Not really an "error", we've run out of holes... Redirect to app.holes
            console.info ('HolesCtrl                         : ' + error);
            console.info ('HolesCtrl                         : redirecting to app.holes');
            $state.go('app.holes');
        });

    };

    GameService.getHole($stateParams.holeId).then(function(hole) {
        $scope.hole = hole;
        GameService.getScore($stateParams.holeId).then(function(score) {
            $scope.hole.score = score;
        });
    }, function(error) {
        console.error('HolesCtrl                     : ' + error);
        console.info ('HolesCtrl                         : redirecting to app.browse');
        $state.go('app.browse');
    });

}]);
