'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', 'GameService', function($scope, GameService) {
// console.log('AppCtrl');
    $scope.totalScore = null;
    $scope.totalPar = null;

    $scope.$watch(function () {
        return GameService.getRound();
    }, function (newVal, oldVal) {
            console.log('newVal', newVal);
            console.log('oldVal', oldVal);
        if (typeof newVal !== 'undefined' && typeof oldVal !== 'undefined' &&
            newVal.length !== oldVal.length
            ) {
            var newTotalScore = 0,
                newtotalPar   = 0;
            _.each(newVal, function(hole) {
                newTotalScore += hole.score;
                newtotalPar += hole.par;
            });
            $scope.totalScore = newTotalScore;
            $scope.totalPar = newtotalPar;
            console.log('newTotalScore :' + newTotalScore);
            console.log('newtotalPar   :' + newtotalPar);
        }
    });
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

.controller('HolesCtrl', ['GameService', '$scope', '$state', '$ionicHistory', function(GameService, $scope, $state, $ionicHistory) {

    if (!GameService.getAllHoles()) {
        // No course (list of holes) loaded, go back to select a course
        $state.go('app.browse');
    }

    $scope.holes = GameService.getAllHoles();
    $scope.$watch(function () {
        return GameService.getAllHoles();
    }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined' && typeof oldVal !== 'undefined' &&
            newVal[0].name !== oldVal[0].name
            ) {
            $scope.holes = newVal;
        }
    });

    $scope.holeScore = function(holeId) {
        var score = GameService.getScore(holeId);
        if (score) {
            return '/ Score ' + score;
        }
    };

}])

.controller('HoleCtrl', ['GameService', '$scope', '$stateParams', '$state', '$ionicHistory', '$ionicViewSwitcher', function(GameService, $scope, $stateParams, $state, $ionicHistory, $ionicViewSwitcher) {


    // Current hole is the scope, assign it and watch the 'hole' for changes (new course?)
    $scope.hole = GameService.getHole($stateParams.holeId);
    $scope.$watch(function () {
        return GameService.getHole($stateParams.holeId);
    }, function (newVal, oldVal) {
        // console.log('newVal', newVal);
        // console.log('oldVal', oldVal);
        // Some real fucky logic going on here
        if (typeof newVal !== 'undefined' && typeof oldVal !== 'undefined' ||
            oldVal !== 'undefined' ||
            oldVal !== 'undefined' && newVal.name !== oldVal.name
            ) {
            // Hole has changed, update the scope
            $scope.holes = newVal;
        }
    });

    $scope.setScore = function(score) {
        GameService.setScore($scope.hole.id, score, $scope.hole.par).then(function(){
            $scope.hole.score = score;
        }, function(error) {
            console.error('HoleCtrl                      : ' + error);
        });
    };

   $scope.back = function() {
        $ionicHistory.clearHistory();
        var prevHole = GameService.getHole(parseInt($stateParams.holeId - 1));

        if (prevHole) {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('app.single', {'holeId': prevHole.id});
        } else {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('app.holes');
        }
    };

    $scope.next = function() {
        $ionicHistory.clearHistory();
        var nextHole = GameService.getHole(parseInt($stateParams.holeId) + 1);

        if (nextHole) {
            $state.go('app.single', {'holeId': nextHole.id});
        } else {
            $state.go('app.holes');
        }
    };

    if (!GameService.getHole($stateParams.holeId)) {
        // No hole loaded, go back to select a course
        $state.go('app.browse');
    }

}])

.controller('ScorecardCtrl', ['$scope', 'GameService', function($scope, GameService) {
    $scope.scores = GameService.getRound();

    $scope.$watch(function () {
        return GameService.getRound();
    }, function (newVal, oldVal) {
        // console.log('newVal', newVal);
        // console.log('oldVal', oldVal);
        // Some real fucky logic going on here
        if (typeof newVal !== 'undefined' && typeof oldVal !== 'undefined' ||
            oldVal !== 'undefined' ||
            oldVal !== 'undefined' && newVal.length !== oldVal.length
            ) {
            $scope.scores = newVal;
        }
    });
}]);
