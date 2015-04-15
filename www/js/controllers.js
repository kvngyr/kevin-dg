'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function() {
    // Nothing here, for now
})

.controller('BrowseCtrl', [
    'GameService',
    '$scope',
    '$ionicModal',
    '$state',
    '$ionicLoading',
    function(
        GameService,
        $scope,
        $ionicModal,
        $state,
        $ionicLoading
    ){

    $scope.startGame = function(course) {
        if (GameService.getRound().length) {
            $scope.modal.show();
            selectedCourseBeforePotentialAbandon = course;
            return;
        }

        $ionicLoading.show({template: 'Loading'});
        GameService.downloadCourse(course).then(function() {
            $ionicLoading.hide();
            $state.go('app.holes');
        }, function(error) {
            console.error('BrowseCtrl                    : ' + error);
        });
    };

    var selectedCourseBeforePotentialAbandon = '';
    $scope.modal = $ionicModal.fromTemplateUrl('templates/newgame.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.abandonGame = function() {
        GameService.endRound();
        $scope.startGame(selectedCourseBeforePotentialAbandon);
        selectedCourseBeforePotentialAbandon = '';
        $scope.modal.hide();
    };

    $scope.continueGame = function() {
        $scope.modal.hide();
        $state.go('app.holes');
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

}])

.controller('HolesCtrl', [
    'GameService',
    'SettingService',
    '$scope',
    '$state',
    function(
        GameService,
        SettingService,
        $scope,
        $state
    ){

    if (!GameService.getAllHoles()) {
        // No course (list of holes) loaded, go back to select a course
        $state.go('app.browse');
    }

    $scope.$watch(function () {
        return GameService.getAllHoles();
    }, function (newVal) {
        $scope.holes = newVal;
    });

    $scope.holeScore = function(holeId) {
        var score = GameService.getScore(holeId);
        if (score) {
            return '/ Score ' + score;
        }
    };

}])

.controller('HoleCtrl', [
    'GameService',
    '$scope',
    '$stateParams',
    '$state',
    '$ionicHistory',
    '$ionicViewSwitcher',
    function(
        GameService,
        $scope,
        $stateParams,
        $state,
        $ionicHistory,
        $ionicViewSwitcher
    ){

    $scope.$watch(function () {
        return GameService.getHole($stateParams.holeId);
    }, function (newVal) {
        $scope.hole = newVal;
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

.controller('SettingsCtrl', [
    '$scope',
    'SettingService',
    function(
        $scope,
        SettingService
    ){

    $scope.hideComplete = SettingService.get('hideComplete');

    $scope.hideCompleteChanged = function() {
        SettingService.set('hideComplete', $scope.hideComplete.checked);
    };
}])

.controller('ScorecardCtrl', ['$scope', 'GameService', function($scope, GameService) {
    // $scope.scores = GameService.getRound();
    // $scope.scores = [
    //     {
    //         id: 1,
    //         par: 3,
    //         score: 3
    //     },
    //     {
    //         id: 2,
    //         par: 3,
    //         score: 2
    //     },
    //     {
    //         id: 3,
    //         par: 3,
    //         score: 2
    //     },
    //     {
    //         id: 4,
    //         par: 4,
    //         score: 3
    //     },
    //     {
    //         id: 5,
    //         par: 3,
    //         score: 2
    //     },
    //     {
    //         id: 6,
    //         par: 3,
    //         score: 3
    //     },
    //     {
    //         id: 7,
    //         par: 3,
    //         score: 3
    //     },
    //     {
    //         id: 8,
    //         par: 3,
    //         score: 2
    //     },
    //     {
    //         id: 9,
    //         par: 3,
    //         score: 2
    //     },
        // {
        //     id: 10,
        //     par: 4,
        //     score: 3
        // },
        // {
        //     id: 11,
        //     par: 3,
        //     score: 2
        // },
        // {
        //     id: 12,
        //     par: 3,
        //     score: 3
        // },
        // {
        //     id: 13,
        //     par: 3,
        //     score: 3
        // },
        // {
        //     id: 14,
        //     par: 3,
        //     score: 3
        // },
        // {
        //     id: 15,
        //     par: 3,
        //     score: 2
        // },
        // {
        //     id: 16,
        //     par: 3,
        //     score: 2
        // },
        // {
        //     id: 17,
        //     par: 4,
        //     score: 3
        // },
        // {
        //     id: 18,
        //     par: 3,
        //     score: 2
        // }
    // ];

    var calcTotals = function(){
        var totScore = 0,
            totPar = 0;
            console.log('calcTotals');
        _.each($scope.scores, function(hole) {
            totScore += hole.score;
            totPar   += hole.par;
        });

        $scope.totalScore = totScore;
        $scope.totalPar = totPar;
    };

    $scope.$watch(function () {
        return GameService.getRound();
    }, function (newVal) {
        console.log('watch scores has changed');
        $scope.scores = newVal;
        calcTotals();
    });
}]);
